export interface T1Input {
  dsElements: number; rawEquivalentElements: number;
  hallucinatedComponents: string[]; hallucinatedProps: string[]; totalComponentUsages: number;
}
export interface T1Result {
  usageRatio: number; hallucinationRate: number; score: number;
  hallucinatedComponents: string[]; hallucinatedProps: string[];
}
export function scoreT1(input: T1Input): T1Result {
  const denom = input.dsElements + input.rawEquivalentElements;
  const usageRatio = denom === 0 ? 0 : input.dsElements / denom;
  const hallCount = input.hallucinatedComponents.length + input.hallucinatedProps.length;
  const usageCount = Math.max(input.totalComponentUsages, 1);
  const hallucinationRate = Math.min(1, hallCount / usageCount);
  return { usageRatio, hallucinationRate, score: usageRatio * (1 - hallucinationRate),
    hallucinatedComponents: input.hallucinatedComponents, hallucinatedProps: input.hallucinatedProps };
}
