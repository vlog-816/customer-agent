import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { runAgent, type ChatMessage } from "./agent.js";
import { domains, getDomain } from "./domains/index.js";

const app = express();
app.use(express.json());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "../public")));

app.get("/api/domains", (_req, res) => {
  res.json(domains.map(({ id, label, greeting, samplePrompts }) => ({ id, label, greeting, samplePrompts })));
});

// Stateless: the client sends the full message history back each turn.
app.post("/api/chat", async (req, res) => {
  const { domain: id, messages } = req.body as { domain: string; messages: ChatMessage[] };
  const domain = getDomain(id);
  if (!domain) return res.status(400).json({ error: "Unknown domain" });
  try {
    const out = await runAgent(domain, messages);
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: (e as Error).message });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Customer agent on http://localhost:${port}`));
