const { prefersReducedMotion, scrollBehavior } = require('../public/scripts/motion');

const win = matches => ({ matchMedia: jest.fn(() => ({ matches })) });

describe('prefersReducedMotion', () => {
  test('is true when the media query matches', () => {
    expect(prefersReducedMotion(win(true))).toBe(true);
  });

  test('queries prefers-reduced-motion: reduce', () => {
    const w = win(false);
    prefersReducedMotion(w);
    expect(w.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  test('is false when it does not match', () => {
    expect(prefersReducedMotion(win(false))).toBe(false);
  });

  test('is false without matchMedia', () => {
    expect(prefersReducedMotion({})).toBe(false);
    expect(prefersReducedMotion(undefined)).toBe(false);
  });
});

describe('scrollBehavior', () => {
  test('is instant under reduced motion', () => {
    expect(scrollBehavior(win(true))).toBe('auto');
  });

  test('is smooth otherwise', () => {
    expect(scrollBehavior(win(false))).toBe('smooth');
  });
});
