import { describe, expect, it } from 'vitest';
import { isConfident, rankLogits } from './predictions';
describe('real model score handling', () => {
  it('uses stable softmax and ranks outputs', () => {
    const result = rankLogits([1001, 1000, 999], ['robin', 'finch', 'duck']);
    expect(result[0].label).toBe('robin');
    expect(result.reduce((sum, p) => sum + p.score, 0)).toBeCloseTo(1);
    expect(result[0].score).toBeCloseTo(0.66524096);
  });
  it('rejects invalid outputs rather than fabricating results', () => {
    expect(() => rankLogits([NaN], ['bird'])).toThrow();
    expect(() => rankLogits([1, 2], ['bird'])).toThrow();
  });
  it('requires both a score threshold and a margin', () => {
    expect(isConfident([{ label: 'a', score: .8 }, { label: 'b', score: .1 }])).toBe(true);
    expect(isConfident([{ label: 'a', score: .6 }, { label: 'b', score: .2 }])).toBe(false);
    expect(isConfident([])).toBe(false);
  });
});
