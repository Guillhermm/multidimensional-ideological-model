const { normalizeCoords, kMeans } = require('../public/scripts/clustering');

describe('normalizeCoords', () => {
  test('returns a unit vector for a standard vector', () => {
    const result = normalizeCoords({ x: 3, y: 0, z: 4 });
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0.8);
  });

  test('length of normalized vector is 1', () => {
    const result = normalizeCoords({ x: 1, y: 2, z: 2 });
    const len = Math.hypot(result.x, result.y, result.z);
    expect(len).toBeCloseTo(1);
  });

  test('handles already-normalized vector', () => {
    const result = normalizeCoords({ x: 1, y: 0, z: 0 });
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  test('handles negative coordinates', () => {
    const result = normalizeCoords({ x: -1, y: -1, z: -1 });
    const len = Math.hypot(result.x, result.y, result.z);
    expect(len).toBeCloseTo(1);
    expect(result.x).toBeLessThan(0);
  });
});

describe('kMeans', () => {
  const makePoint = (x, y, z) => ({ x, y, z });

  test('returns empty array when points fewer than k', () => {
    const result = kMeans([makePoint(1, 0, 0), makePoint(0, 1, 0)], 3);
    expect(result).toEqual([]);
  });

  test('returns k centroids', () => {
    const points = [
      makePoint(1, 0, 0),
      makePoint(0.9, 0.1, 0),
      makePoint(-1, 0, 0),
      makePoint(-0.9, -0.1, 0),
      makePoint(0, 1, 0),
      makePoint(0, 0.9, 0.1),
    ];
    const result = kMeans(points, 3);
    expect(result).toHaveLength(3);
  });

  test('each centroid is a unit vector', () => {
    const points = [
      makePoint(1, 0, 0),
      makePoint(0.9, 0.1, 0),
      makePoint(-1, 0, 0),
      makePoint(-0.9, 0, 0.1),
      makePoint(0, 0, 1),
      makePoint(0, 0.1, 0.9),
    ];
    const result = kMeans(points, 3);
    result.forEach(c => {
      const len = Math.hypot(c.x, c.y, c.z);
      expect(len).toBeCloseTo(1);
    });
  });

  test('returns k=1 centroid for k=1', () => {
    const points = [makePoint(1, 0, 0), makePoint(0, 1, 0), makePoint(0, 0, 1)];
    const result = kMeans(points, 1);
    expect(result).toHaveLength(1);
    const len = Math.hypot(result[0].x, result[0].y, result[0].z);
    expect(len).toBeCloseTo(1);
  });

  test('handles identical points', () => {
    const points = Array.from({ length: 5 }, () => makePoint(0.5, 0.5, 0.5));
    const result = kMeans(points, 2);
    expect(result).toHaveLength(2);
    result.forEach(c => {
      const len = Math.hypot(c.x, c.y, c.z);
      expect(len).toBeCloseTo(1);
    });
  });

  test('groups clearly separated points correctly', () => {
    const points = [
      makePoint(1, 0, 0),
      makePoint(0.99, 0.01, 0),
      makePoint(-1, 0, 0),
      makePoint(-0.99, 0.01, 0),
      makePoint(0, 1, 0),
      makePoint(0.01, 0.99, 0),
    ];
    const result = kMeans(points, 3, 10);
    expect(result).toHaveLength(3);
    // Each centroid should be close to one of the original cluster directions
    const directions = [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }];
    result.forEach(c => {
      const isClose = directions.some(d =>
        Math.abs(c.x * d.x + c.y * d.y + c.z * d.z) > 0.9
      );
      expect(isClose).toBe(true);
    });
  });
});
