const prefersReducedMotion = (win = typeof window !== 'undefined' ? window : undefined) =>
  !!(win && typeof win.matchMedia === 'function' &&
    win.matchMedia('(prefers-reduced-motion: reduce)').matches);

const scrollBehavior = win => (prefersReducedMotion(win) ? 'auto' : 'smooth');

if (typeof module !== 'undefined') module.exports = { prefersReducedMotion, scrollBehavior };
