// Set up globals that projection.js depends on (from core.js)
global.cx = () => 400;
global.cy = () => 300;

const {
  setRotation,
  setZoom,
  rotate,
  project,
  normalize,
  rgbFromCoord
} = require('../scripts/projection');

describe('normalize', () => {
  test('returns unit vector', () => {
    const result = normalize({ x: 0, y: 3, z: 4 });
    expect(Math.hypot(result.x, result.y, result.z)).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0.6);
    expect(result.z).toBeCloseTo(0.8);
  });

  test('handles negative components', () => {
    const result = normalize({ x: -2, y: 0, z: 0 });
    expect(result.x).toBeCloseTo(-1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });
});

describe('rotate', () => {
  // Each test module requires a fresh module state since ax/ay are module-level
  // We call setRotation to position ax/ay before testing rotate

  test('at zero rotation, point is unchanged', () => {
    // Reset rotation to 0 by requiring a fresh copy
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { rotate } = require('../scripts/projection');
    const p = { x: 0.5, y: 0.3, z: 0.2 };
    const result = rotate(p);
    expect(result.x).toBeCloseTo(0.5);
    expect(result.y).toBeCloseTo(0.3);
    expect(result.z).toBeCloseTo(0.2);
  });

  test('preserves vector magnitude', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { setRotation, rotate } = require('../scripts/projection');
    setRotation(100, 50); // arbitrary rotation
    const p = { x: 0.6, y: -0.5, z: 0.3 };
    const result = rotate(p);
    const origLen = Math.hypot(p.x, p.y, p.z);
    const rotLen = Math.hypot(result.x, result.y, result.z);
    expect(rotLen).toBeCloseTo(origLen);
  });

  test('90-degree Y rotation swaps x and z', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { setRotation, rotate } = require('../scripts/projection');
    // dy=0, dx such that ay = PI/2: dx * 0.005 = PI/2 => dx = PI / 0.01
    setRotation(Math.PI / 0.01, 0);
    const p = { x: 1, y: 0, z: 0 };
    const result = rotate(p);
    expect(result.z).toBeCloseTo(1);
    expect(result.x).toBeCloseTo(0);
  });
});

describe('setZoom', () => {
  test('zoom is clamped to MAX_ZOOM', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { setZoom, project } = require('../scripts/projection');
    setZoom(1000); // would make zoom huge
    // project with a very large zoom; scale = (radius * zoom) / (2 - z)
    // We just ensure no exception; clamped at 5
    const result = project({ x: 0, y: 0, z: 0 }, 100);
    // scale = (100 * 5) / (2 - 0) = 250
    expect(result.scale).toBeCloseTo(250);
  });

  test('zoom is clamped to MIN_ZOOM', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { setZoom, project } = require('../scripts/projection');
    setZoom(0.0001); // would make zoom tiny
    const result = project({ x: 0, y: 0, z: 0 }, 100);
    // scale = (100 * 0.5) / 2 = 25
    expect(result.scale).toBeCloseTo(25);
  });
});

describe('project', () => {
  test('projects point to 2D with correct formula', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { project } = require('../scripts/projection');
    // zoom=1 (default), radius=200, z=0 → scale = 200*1/(2-0) = 100
    const result = project({ x: 0.5, y: 0.5, z: 0 }, 200);
    expect(result.scale).toBeCloseTo(100);
    expect(result.x).toBeCloseTo(400 + 0.5 * 100); // cx + x*scale
    expect(result.y).toBeCloseTo(300 - 0.5 * 100); // cy - y*scale
    expect(result.z).toBeCloseTo(0);
  });

  test('z value is preserved in result', () => {
    jest.resetModules();
    global.cx = () => 400;
    global.cy = () => 300;
    const { project } = require('../scripts/projection');
    const result = project({ x: 0, y: 0, z: 0.7 }, 100);
    expect(result.z).toBeCloseTo(0.7);
  });
});

describe('rgbFromCoord', () => {
  test('returns a string starting with rgb(', () => {
    const result = rgbFromCoord(0, 0, 1);
    expect(result).toMatch(/^rgb\(/);
  });

  test('full-positive coordinates produce valid rgb', () => {
    const result = rgbFromCoord(1, 1, 1);
    // r = g = b = 1, z=1 so normal facing camera → full intensity
    expect(result).toMatch(/^rgb\(/);
    const parts = result.match(/\d+/g).map(Number);
    parts.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    });
  });

  test('all-zero coordinates produce ambient-only color', () => {
    // x=y=z=0: r=g=b=0.5, intensity = 0 (dot with lightDir) → ambient=0.2
    const result = rgbFromCoord(0, 0, 0);
    const parts = result.match(/\d+/g).map(Number);
    // each channel = 0.5 * 0.2 * 255 = 25
    parts.forEach(v => {
      expect(v).toBeCloseTo(25, -1); // within ±5
    });
  });

  test('negative-z coordinate (dark side) uses only ambient light', () => {
    // x=0, y=0, z=-1: dot product with lightDir (0,0,1) = -1, clamped to 0
    // intensity = ambient = 0.2
    // r=(0+1)/2=0.5, g=(0+1)/2=0.5, b=(-1+1)/2=0
    // channels: r=0.5*0.2*255=25, g=25, b=0
    const result = rgbFromCoord(0, 0, -1);
    const parts = result.match(/\d+/g).map(Number);
    expect(parts[0]).toBeCloseTo(25, -1); // r ≈ 25
    expect(parts[1]).toBeCloseTo(25, -1); // g ≈ 25
    expect(parts[2]).toBe(0);             // b = 0
  });

  test('rgb values are integers (no decimals)', () => {
    const result = rgbFromCoord(0.5, -0.3, 0.7);
    expect(result).not.toMatch(/\./);
  });
});
