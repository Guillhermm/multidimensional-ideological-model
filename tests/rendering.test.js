// Track strokeStyle assignments via setter so we can assert on axis colors
const strokeStyles = [];
const fillStyles = [];

const mockCtx = {
  get strokeStyle() { return strokeStyles[strokeStyles.length - 1] ?? ''; },
  set strokeStyle(v) { strokeStyles.push(v); },
  get fillStyle() { return fillStyles[fillStyles.length - 1] ?? ''; },
  set fillStyle(v) { fillStyles.push(v); },
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
};

global.ctx = mockCtx;
global.cx = () => 400;
global.cy = () => 300;
global.rotate = p => p;
global.project = (p, radius) => ({ x: 400 + p.x * radius, y: 300 - p.y * radius, scale: radius, z: p.z });
global.rgbFromCoord = () => 'rgb(128, 128, 128)';

const { drawSphereGradient, drawAxes } = require('../public/scripts/rendering');

describe('drawSphereGradient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    strokeStyles.length = 0;
    fillStyles.length = 0;
  });

  test('draws exactly 2500 sphere surface points', () => {
    drawSphereGradient(200);
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2500);
  });

  test('each point is drawn as a 2×2 pixel rect', () => {
    drawSphereGradient(200);
    const calls = mockCtx.fillRect.mock.calls;
    calls.forEach(([, , w, h]) => {
      expect(w).toBe(2);
      expect(h).toBe(2);
    });
  });

  test('draws a single equator reference circle', () => {
    drawSphereGradient(200);
    expect(mockCtx.arc).toHaveBeenCalledTimes(1);
  });

  test('equator circle radius is 75% of sphere radius', () => {
    drawSphereGradient(200);
    const [, , arcRadius] = mockCtx.arc.mock.calls[0];
    expect(arcRadius).toBeCloseTo(200 * 0.75);
  });

  test('equator circle is centred on canvas centre', () => {
    drawSphereGradient(200);
    const [cx, cy] = mockCtx.arc.mock.calls[0];
    expect(cx).toBe(400);
    expect(cy).toBe(300);
  });

  test('equator circle spans a full 2π arc', () => {
    drawSphereGradient(200);
    const [, , , start, end] = mockCtx.arc.mock.calls[0];
    expect(start).toBe(0);
    expect(end).toBeCloseTo(Math.PI * 2);
  });

  test('calls stroke to render the equator circle', () => {
    drawSphereGradient(200);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(1);
  });
});

describe('drawAxes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    strokeStyles.length = 0;
    fillStyles.length = 0;
  });

  test('draws exactly 3 axis lines', () => {
    drawAxes(200);
    expect(mockCtx.stroke).toHaveBeenCalledTimes(3);
  });

  test('calls moveTo once per axis from canvas centre', () => {
    drawAxes(200);
    expect(mockCtx.moveTo).toHaveBeenCalledTimes(3);
    mockCtx.moveTo.mock.calls.forEach(([x, y]) => {
      expect(x).toBe(400);
      expect(y).toBe(300);
    });
  });

  test('calls lineTo once per axis', () => {
    drawAxes(200);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
  });

  test('draws axes in red, green, and blue', () => {
    drawAxes(200);
    expect(strokeStyles).toContain('red');
    expect(strokeStyles).toContain('green');
    expect(strokeStyles).toContain('blue');
  });

  test('each axis starts a fresh path', () => {
    drawAxes(200);
    expect(mockCtx.beginPath).toHaveBeenCalledTimes(3);
  });
});
