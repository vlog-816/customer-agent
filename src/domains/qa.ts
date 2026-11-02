import type { Domain } from "../types.js";

const bugs: { id: string; title: string; severity: string; steps: string[]; expected: string; actual: string }[] = [];

export const qa: Domain = {
  id: "qa",
  label: "Manual testing assistant",
  greeting: "Hi! I help manual testers: writing test cases, filing bug reports, and following our QA process. What are you testing?",
  instructions:
    "You assist manual software testers. Help them design test cases (positive, negative, boundary, edge), write clear bug reports, judge severity/priority using the team's guidelines, and follow the QA process. Ask what feature or build they are testing if unclear. When the tester has given title, steps, expected and actual results, offer to file the bug with log_bug.",
  knowledge: "",
  knowledgeDir: "qa", // drop your own .md/.txt docs into knowledge/qa/
  samplePrompts: [
    "Write test cases for a login form",
    "What severity is a typo on the checkout page?",
    "File a bug: cart total wrong after removing an item",
    "What's our process before a release?",
    "List the bugs filed so far",
  ],
  tools: [
    {
      name: "log_bug",
      description: "File a bug report. Only call once you have title, severity, steps, expected and actual results.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["critical", "major", "minor", "trivial"] },
          steps: { type: "array", items: { type: "string" } },
          expected: { type: "string" },
          actual: { type: "string" },
        },
        required: ["title", "severity", "steps", "expected", "actual"],
      },
      run: (b) => {
        const bug = { id: "BUG-" + (bugs.length + 101), ...b };
        bugs.push(bug);
        return { ok: true, id: bug.id };
      },
    },
    {
      name: "list_bugs",
      description: "List bugs filed in this session.",
      input_schema: { type: "object", properties: {} },
      run: () => bugs.map(({ id, title, severity }) => ({ id, title, severity })),
    },
  ],
};
