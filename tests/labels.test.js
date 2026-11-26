const { layoutLabels, nearestPoint, boxesOverlap } = require('../public/scripts/labels');

const measure = name => name.length * 6;
const names = placed => placed.map(l => l.name);

describe('layoutLabels', () => {
  test('keeps every label when nothing overlaps', () => {
    const points = [
      { name: 'A', x: 10, y: 20, z: 0 },
      { name: 'B', x: 200, y: 200, z: 0 },
    ];
    expect(names(layoutLabels(points, { measure }))).toEqual(['A', 'B']);
  });

  test('skips the farther of two overlapping labels', () => {
    const points = [
      { name: 'Far', x: 100, y: 100, z: -0.5 },
      { name: 'Near', x: 102, y: 102, z: 0.8 },
    ];
    expect(names(layoutLabels(points, { measure }))).toEqual(['Near']);
  });

  test('a forced label wins over a nearer one and is always drawn', () => {
    const points = [
      { name: 'Far', x: 100, y: 100, z: -0.5 },
      { name: 'Near', x: 102, y: 102, z: 0.8 },
    ];
    const placed = layoutLabels(points, { measure, forced: new Set(['Far']) });
    expect(names(placed)).toEqual(['Far']);
  });

  test('two forced labels are both drawn even when they overlap', () => {
    const points = [
      { name: 'A', x: 100, y: 100, z: 0 },
      { name: 'B', x: 101, y: 101, z: 0 },
    ];
    const placed = layoutLabels(points, { measure, forced: new Set(['A', 'B']) });
    expect(names(placed)).toHaveLength(2);
  });

  test('no two placed non-forced labels overlap', () => {
    const points = Array.from({ length: 40 }, (_, i) => ({
      name: `Label ${i}`,
      x: (i * 37) % 120,
      y: (i * 53) % 80,
      z: Math.sin(i),
    }));
    const placed = layoutLabels(points, { measure });
    placed.forEach((a, i) => placed.slice(i + 1).forEach(b => {
      expect(boxesOverlap(a.box, b.box)).toBe(false);
    }));
  });

  test('flips a label to the left of its point near the right edge', () => {
    const [label] = layoutLabels([{ name: 'Fascism', x: 380, y: 50, z: 0 }], { measure, maxX: 390 });
    expect(label.x + measure('Fascism')).toBeLessThanOrEqual(380);
  });

  test('puts the label to the right of the point when it fits', () => {
    const [label] = layoutLabels([{ name: 'Fascism', x: 50, y: 50, z: 0 }], { measure, maxX: 390 });
    expect(label.x).toBe(56);
  });

  test('does not mutate its input', () => {
    const points = [{ name: 'A', x: 1, y: 1, z: 0 }, { name: 'B', x: 1, y: 1, z: 1 }];
    layoutLabels(points, { measure });
    expect(points.map(p => p.name)).toEqual(['A', 'B']);
  });
});

describe('nearestPoint', () => {
  const points = [
    { name: 'A', x: 10, y: 10 },
    { name: 'B', x: 30, y: 10 },
  ];

  test('returns null without a pointer', () => {
    expect(nearestPoint(points, null, 20)).toBeNull();
  });

  test('returns the closest point within range', () => {
    expect(nearestPoint(points, { x: 27, y: 12 }, 20)).toBe('B');
  });

  test('returns null when every point is out of range', () => {
    expect(nearestPoint(points, { x: 200, y: 200 }, 20)).toBeNull();
  });
});
