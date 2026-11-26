const { serializePosition, parsePosition } = require('../public/scripts/position-hash');

describe('serializePosition', () => {
  test('writes a fragment, never a query string', () => {
    const h = serializePosition({ x: 0.4, y: -0.2, z: 0 });
    expect(h).toBe('#x=0.4&y=-0.2&z=0&from=quiz');
    expect(h).not.toContain('?');
  });

  test('can omit the quiz marker', () => {
    expect(serializePosition({ x: 1, y: 1, z: 1 }, false)).toBe('#x=1&y=1&z=1');
  });
});

describe('parsePosition', () => {
  test('round-trips a serialized position', () => {
    const pos = { x: 0.6, y: -1, z: 0.123 };
    expect(parsePosition(serializePosition(pos))).toEqual({ ...pos, fromQuiz: true });
  });

  test('clamps out-of-range values to [-1, 1]', () => {
    expect(parsePosition('#x=5&y=-9&z=0.5')).toEqual({ x: 1, y: -1, z: 0.5, fromQuiz: false });
  });

  test('ignores non-numeric values and missing axes', () => {
    expect(parsePosition('#x=abc&z=0.2')).toEqual({ z: 0.2, fromQuiz: false });
  });

  test('handles an empty or missing hash', () => {
    expect(parsePosition('')).toEqual({ fromQuiz: false });
    expect(parsePosition(undefined)).toEqual({ fromQuiz: false });
  });
});
