// Sliders are captured by reference at module load — mutate .value to control getUser()
const xSliderMock = { value: '0' };
const ySliderMock = { value: '0' };
const zSliderMock = { value: '0' };

const mockCtx = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  fillText: jest.fn(),
  fillRect: jest.fn(),
  strokeStyle: '',
  fillStyle: '',
  font: '',
};

const infoEl = { innerHTML: '' };
const mockLink = { download: '', href: '', click: jest.fn() };

global.document = {
  getElementById: jest.fn().mockImplementation(id => ({
    xSlider: xSliderMock,
    ySlider: ySliderMock,
    zSlider: zSliderMock,
    exportPNG: { onclick: null },
  }[id] ?? null)),
  querySelector: jest.fn().mockReturnValue(infoEl),
  createElement: jest.fn().mockReturnValue(mockLink),
};

// Canvas and 2D context
global.canvas = {
  width: 800,
  height: 600,
  toDataURL: jest.fn().mockReturnValue('data:image/png;base64,abc'),
};
global.ctx = mockCtx;

// Core helpers from other modules
global.cx = () => 400;
global.cy = () => 300;
global.rotate = p => p;
global.project = (p, r) => ({ x: 400 + p.x * r, y: 300 - p.y * r, scale: r, z: p.z });
global.rgbFromCoord = () => 'rgb(128, 128, 128)';
global.drawSphereGradient = jest.fn();
global.drawAxes = jest.fn();
global.applyHistoricalForces = jest.fn();
global.kMeans = jest.fn().mockReturnValue([]);

// Time state globals
global.currentYear = 2000;
global.maxYear = 2026;
global.minYear = 1789;
global.auto = false;
global.timeSlider = { value: '2000' };
global.yearLabel = { innerText: '2000' };

// Minimal ideology list for animate() to iterate over
global.ideologies = [
  {
    name: 'Test',
    x: 0.5, y: 0.5, z: 0.5,
    base: { x: 0.5, y: 0.5, z: 0.5 },
    startYear: 1800,
    trail: [],
    velocity: 0,
    prev: null,
  },
];

// Prevent the recursive animation loop from running
global.requestAnimationFrame = jest.fn();

const { getUser } = require('../public/scripts/main');

describe('getUser', () => {
  beforeEach(() => {
    xSliderMock.value = '0';
    ySliderMock.value = '0';
    zSliderMock.value = '0';
  });

  test('returns an object named "You"', () => {
    const user = getUser();
    expect(user.name).toBe('You');
  });

  test('centrist position (0, 0, 0) is returned as-is', () => {
    const user = getUser();
    expect(user.x).toBe(0);
    expect(user.y).toBe(0);
    expect(user.z).toBe(0);
  });

  test('position within unit sphere is returned unchanged', () => {
    xSliderMock.value = '0.5';
    ySliderMock.value = '0.3';
    zSliderMock.value = '0.2';
    const user = getUser();
    // len ≈ 0.616 < 1 → no normalisation
    expect(user.x).toBeCloseTo(0.5);
    expect(user.y).toBeCloseTo(0.3);
    expect(user.z).toBeCloseTo(0.2);
  });

  test('position outside unit sphere is normalised to the surface', () => {
    xSliderMock.value = '1';
    ySliderMock.value = '1';
    zSliderMock.value = '1';
    const user = getUser();
    const len = Math.sqrt(user.x ** 2 + user.y ** 2 + user.z ** 2);
    expect(len).toBeCloseTo(1);
  });

  test('normalisation preserves direction', () => {
    xSliderMock.value = '2';
    ySliderMock.value = '0';
    zSliderMock.value = '0';
    const user = getUser();
    expect(user.x).toBeCloseTo(1);
    expect(user.y).toBeCloseTo(0);
    expect(user.z).toBeCloseTo(0);
  });

  test('extreme diagonal is normalised correctly', () => {
    xSliderMock.value = '1';
    ySliderMock.value = '-1';
    zSliderMock.value = '1';
    const user = getUser();
    const len = Math.sqrt(user.x ** 2 + user.y ** 2 + user.z ** 2);
    expect(len).toBeCloseTo(1);
    expect(user.y).toBeLessThan(0); // direction preserved
  });

  test('position exactly on unit sphere boundary is returned unchanged', () => {
    // ||(1,0,0)|| = 1 → not > 1, so no normalisation
    xSliderMock.value = '1';
    ySliderMock.value = '0';
    zSliderMock.value = '0';
    const user = getUser();
    expect(user.x).toBeCloseTo(1);
    expect(Math.sqrt(user.x ** 2 + user.y ** 2 + user.z ** 2)).toBeCloseTo(1);
  });

  test('negative axis values are preserved correctly', () => {
    xSliderMock.value = '-0.5';
    ySliderMock.value = '-0.5';
    zSliderMock.value = '0';
    const user = getUser();
    expect(user.x).toBeCloseTo(-0.5);
    expect(user.y).toBeCloseTo(-0.5);
  });
});
