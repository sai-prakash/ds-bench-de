export interface T3Input {
  runtimeErrors: number; checksPassed: number; checksTotal: number;
  axeViolationsByImpact: { critical: number; serious: number; moderate: number; minor: number };
  keyboardReachable: number; keyboardInteractive: number;
}
export interface T3Result { runtimeClean: 0 | 1; structural: number; axeWeighted: number; keyboardRatio: number; score: number; }
export function axeWeightedPenalty(v: T3Input["axeViolationsByImpact"]): number {
  const raw = v.critical * 1 + v.serious * 0.6 + v.moderate * 0.3 + v.minor * 0.1;
  return Math.min(1, raw / 10);
}
export function scoreT3(input: T3Input): T3Result {
  const runtimeClean = input.runtimeErrors === 0 ? 1 : 0;
  const structural = input.checksTotal === 0 ? 0 : input.checksPassed / input.checksTotal;
  const axeWeighted = 1 - axeWeightedPenalty(input.axeViolationsByImpact);
  const keyboardRatio = input.keyboardInteractive === 0 ? 0 : input.keyboardReachable / input.keyboardInteractive;
  const score = 0.25 * runtimeClean + 0.35 * structural + 0.2 * axeWeighted + 0.2 * keyboardRatio;
  return { runtimeClean, structural, axeWeighted, keyboardRatio, score };
}
