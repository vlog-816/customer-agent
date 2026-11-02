# Customer Agent

A domain-switchable customer support agent (Claude + TypeScript) with a web chat and a tool-call panel for manual testing.

## Run

```bash
npm install
set ANTHROPIC_API_KEY=sk-ant-...     # PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
npm run dev
```

Open http://localhost:3000, pick a domain, click a sample prompt or type your own.
The right panel shows every tool call (input and output) so you can verify the agent's behavior.

## Add a domain

Create `src/domains/<name>.ts` exporting a `Domain` (instructions, knowledge, tools, sample prompts), then add it to `src/domains/index.ts`.

## Your own docs

Put `.md` or `.txt` files in `knowledge/qa/` (the "Manual testing assistant" domain reads them on every message, no restart needed). Any domain can use this: set `knowledgeDir: "<folder>"` and add files under `knowledge/<folder>/`. The two sample files there are placeholders.

## Things to manually test

- Correct lookups vs. invented data (try a non-existent order number)
- Policy refusals (cancel a shipped order)
- Missing info (does it ask for the order number?)
- Angry customer / out-of-scope request -> `handoff_to_human`
- Multi-turn memory, and domain switching (resets the chat)
