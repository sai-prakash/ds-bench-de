export type BuildErrorCategory = "type_error" | "missing_import" | "syntax" | "bundler" | "none";
export interface T0Input { tscExit: number; viteExit: number; tscStderr: string; viteStderr: string; }
export interface T0Result { score: 0 | 1; category: BuildErrorCategory; }
export function classifyError(stderr: string): BuildErrorCategory {
  const s = stderr.toLowerCase();
  if (!s.trim()) return "none";
  if (s.includes("ts2307") || s.includes("cannot find module") || s.includes("module not found")) return "missing_import";
  if (s.includes("ts1") || s.includes("error ts") || s.includes("type error")) return "type_error";
  if (s.includes("syntaxerror") || s.includes("unexpected token")) return "syntax";
  return "bundler";
}
export function scoreT0(input: T0Input): T0Result {
  if (input.tscExit === 0 && input.viteExit === 0) return { score: 1, category: "none" };
  const category = classifyError(`${input.tscStderr}\n${input.viteStderr}`);
  return { score: 0, category: category === "none" ? "bundler" : category };
}
