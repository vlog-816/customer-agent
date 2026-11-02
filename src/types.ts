export interface AgentTool {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required?: string[] };
  run: (input: any) => unknown;
}

export interface Domain {
  id: string;
  label: string;
  greeting: string;
  /** Company/role/policy instructions for this domain. */
  instructions: string;
  /** Knowledge-base text the agent may quote from. */
  knowledge: string;
  /** Optional folder under knowledge/ whose .md/.txt files are added to the knowledge base. */
  knowledgeDir?: string;
  tools: AgentTool[];
  /** Example messages a tester can click to try. */
  samplePrompts: string[];
}

export interface ToolTrace {
  tool: string;
  input: unknown;
  output: unknown;
}
