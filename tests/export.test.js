const { exportFileName, composeExport, EXPORT_BACKGROUND } = require('../public/scripts/export');

describe('exportFileName', () => {
  test('uses a zero-padded local date', () => {
    expect(exportFileName(new Date(2026, 0, 5))).toBe('ideological-model-20260105.png');
  });
});

describe('composeExport', () => {
  const make = () => {
    const calls = [];
    const ctx = {
      set fillStyle(v) { calls.push(['fillStyle', v]); },
      fillRect: (...a) => calls.push(['fillRect', ...a]),
      drawImage: (...a) => calls.push(['drawImage', ...a]),
    };
    const out = { getContext: () => ctx };
    return { out, calls };
  };

  test('matches the source size', () => {
    const { out } = make();
    const source = { width: 390, height: 844 };
    expect(composeExport(source, () => out)).toBe(out);
    expect([out.width, out.height]).toEqual([390, 844]);
  });

  test('paints the opaque background before the scene', () => {
    const { out, calls } = make();
    const source = { width: 100, height: 50 };
    composeExport(source, () => out);
    expect(calls).toEqual([
      ['fillStyle', EXPORT_BACKGROUND],
      ['fillRect', 0, 0, 100, 50],
      ['drawImage', source, 0, 0],
    ]);
  });
});
