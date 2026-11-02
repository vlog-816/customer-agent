import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../knowledge");
const MAX_CHARS = 150_000; // keep the prompt bounded

/** Reads every .md/.txt file in knowledge/<dir>/ fresh on each call, so edits apply without restart. */
export function loadKnowledgeDir(dir: string): string {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return "";
  const parts: string[] = [];
  for (const file of fs.readdirSync(full).sort()) {
    if (!/\.(md|txt)$/i.test(file)) continue;
    parts.push(`## ${file}\n${fs.readFileSync(path.join(full, file), "utf8").trim()}`);
  }
  return parts.join("\n\n").slice(0, MAX_CHARS);
}
