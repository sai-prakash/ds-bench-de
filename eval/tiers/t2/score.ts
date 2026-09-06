export interface T2Input { tokenUsages: number; hardCodes: number; illegalOverrides: number; }
export interface T2Result { tokenDiscipline: number; tokenUsages: number; hardCodes: number; illegalOverrides: number; }
export function scoreT2(input: T2Input): T2Result {
  const denom = input.tokenUsages + input.hardCodes;
  return { tokenDiscipline: denom === 0 ? 0 : input.tokenUsages / denom, ...input };
}
