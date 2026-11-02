import Anthropic from "@anthropic-ai/sdk";
import type { AgentTool, Domain, ToolTrace } from "./types.js";
import { loadKnowledgeDir } from "./knowledge.js";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5";
const MAX_STEPS = 8;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

/** Available in every domain: lets the agent give up gracefully. */
const handoffTool: AgentTool = {
  name: "handoff_to_human",
  description:
    "Escalate to a human agent when the customer is upset, asks for something outside policy, or you cannot resolve it.",
  input_schema: {
    type: "object",
    properties: { reason: { type: "string", description: "Why escalation is needed" } },
    required: ["reason"],
  },
  run: ({ reason }) => ({ ticket: "ESC-" + Math.floor(Math.random() * 90000 + 10000), reason, eta: "within 1 business day" }),
};

function systemPrompt(domain: Domain): string {
  return `You are a customer support agent.

${domain.instructions}

Rules:
- Be concise, friendly and accurate. Never invent policies, order data or prices.
- Use tools to look up real data; answer policy questions only from the knowledge base below.
- Ask for missing details (e.g. order number) before calling a tool.
- If you don't know or can't help, say so and use handoff_to_human.

# Knowledge base
${domain.knowledge}
${domain.knowledgeDir ? "\n" + loadKnowledgeDir(domain.knowledgeDir) : ""}`;
}

export type ChatMessage = Anthropic.MessageParam;

export async function runAgent(domain: Domain, history: ChatMessage[]) {
  const tools = [...domain.tools, handoffTool];
  const byName = new Map(tools.map((t) => [t.name, t]));
  const messages: ChatMessage[] = [...history];
  const traces: ToolTrace[] = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt(domain),
      tools: tools.map(({ name, description, input_schema }) => ({ name, description, input_schema })),
      messages,
    });
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      const reply = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return { reply, messages, traces };
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      let output: unknown;
      let isError = false;
      try {
        const tool = byName.get(block.name);
        if (!tool) throw new Error(`Unknown tool ${block.name}`);
        output = tool.run(block.input);
      } catch (e) {
        output = { error: (e as Error).message };
        isError = true;
      }
      traces.push({ tool: block.name, input: block.input, output });
      results.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(output),
        is_error: isError,
      });
    }
    messages.push({ role: "user", content: results });
  }
  return { reply: "Sorry, I couldn't finish that request. A human will follow up.", messages, traces };
}
