// P0 characterization only. These tests describe legacy behavior, not V3 acceptance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreT0 } from '../eval/tiers/t0/score.ts';
import { scoreT1 } from '../eval/tiers/t1/score.ts';
import { scoreT2 } from '../eval/tiers/t2/score.ts';
import { scoreT3 } from '../eval/tiers/t3/score.ts';
test('legacy T0 detects both successful and failing builds', () => {
  assert.equal(scoreT0({ tscExit: 0, viteExit: 0, tscStderr: '', viteStderr: '' }).score, 1);
  assert.deepEqual(scoreT0({ tscExit: 1, viteExit: 0, tscStderr: 'TS2307: Cannot find module', viteStderr: '' }), {score: 0, category: 'missing_import'});
});
test('legacy T1 exhibits padding bias; migration required', () => {
  const x = { dsElements: 1, rawEquivalentElements: 1, hallucinatedComponents: ['invalid'], hallucinatedProps: [], totalComponentUsages: 2 };
  assert.ok(scoreT1({...x, dsElements: 100, totalComponentUsages: 101}).score > scoreT1(x).score);
});
test('legacy T2 exhibits empty-style and override defects; migration required', () => {
  assert.equal(scoreT2({tokenUsages: 0, hardCodes: 0, illegalOverrides: 0}).tokenDiscipline, 0);
  assert.equal(scoreT2({tokenUsages: 1, hardCodes: 0, illegalOverrides: 5}).tokenDiscipline, 1);
});
test('legacy T3 accepts empty state with partial credit; migration required', () => {
  const x = {runtimeErrors: 0, checksPassed: 0, checksTotal: 0, axeViolationsByImpact: {critical: 0, serious: 0, moderate: 0, minor: 0}, keyboardReachable: 0, keyboardInteractive: 0};
  assert.equal(scoreT3(x).score, 0.45);
  assert.equal(scoreT3({...x, checksPassed: 1, checksTotal: 1, keyboardReachable: 1, keyboardInteractive: 1}).score, 1);
});
