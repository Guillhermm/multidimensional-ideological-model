const { withAnswer, isChecked, firstUnanswered } = require('../public/scripts/quiz-state');

const empty = () => new Array(15).fill(null);

describe('withAnswer', () => {
  test('sets one answer and leaves the others', () => {
    const next = withAnswer(empty(), 3, -2);
    expect(next[3]).toBe(-2);
    expect(next.filter(a => a === null)).toHaveLength(14);
  });

  test('does not mutate the previous state', () => {
    const before = empty();
    withAnswer(before, 0, 1);
    expect(before[0]).toBeNull();
  });

  test('replacing an answer keeps a single checked radio per question', () => {
    const next = withAnswer(withAnswer(empty(), 2, -1), 2, 2);
    const checked = [-2, -1, 0, 1, 2].filter(v => isChecked(next, 2, v));
    expect(checked).toEqual([2]);
  });
});

describe('isChecked', () => {
  test('a neutral answer (0) counts as checked, not as unanswered', () => {
    const next = withAnswer(empty(), 1, 0);
    expect(isChecked(next, 1, 0)).toBe(true);
    expect(isChecked(empty(), 1, 0)).toBe(false);
  });
});

describe('firstUnanswered', () => {
  test('returns -1 when the section is complete', () => {
    let a = empty();
    for (let i = 0; i <= 4; i++) a = withAnswer(a, i, 0);
    expect(firstUnanswered(a, [0, 4])).toBe(-1);
  });

  test('returns the first gap inside the section range only', () => {
    let a = withAnswer(empty(), 5, 1);
    a = withAnswer(a, 7, 1);
    expect(firstUnanswered(a, [5, 9])).toBe(6);
  });
});
