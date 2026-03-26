// Capture event listeners registered by interaction.js on canvas and window
const canvasListeners = {};
const windowListeners = {};

global.canvas = {
  addEventListener: jest.fn().mockImplementation((event, handler) => {
    canvasListeners[event] = handler;
  }),
};

global.window = {
  addEventListener: jest.fn().mockImplementation((event, handler) => {
    windowListeners[event] = handler;
  }),
};

// Globals that the event handlers delegate to (from projection.js)
global.setRotation = jest.fn();
global.setZoom = jest.fn();
global.zoom = 1;

// Load the module — event listeners are registered at module load time
require('../public/scripts/interaction');

describe('interaction: event listener registration', () => {
  test('registers mousedown on canvas', () => {
    expect(canvasListeners).toHaveProperty('mousedown');
  });

  test('registers mouseup on canvas', () => {
    expect(canvasListeners).toHaveProperty('mouseup');
  });

  test('registers mousemove on canvas', () => {
    expect(canvasListeners).toHaveProperty('mousemove');
  });

  test('registers wheel on canvas', () => {
    expect(canvasListeners).toHaveProperty('wheel');
  });

  test('registers keydown on window', () => {
    expect(windowListeners).toHaveProperty('keydown');
  });

  test('registers touchstart on canvas', () => {
    expect(canvasListeners).toHaveProperty('touchstart');
  });

  test('registers touchmove on canvas', () => {
    expect(canvasListeners).toHaveProperty('touchmove');
  });

  test('registers touchend on canvas', () => {
    expect(canvasListeners).toHaveProperty('touchend');
  });
});

describe('interaction: mouse drag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.zoom = 1;
  });

  test('mousemove after mousedown calls setRotation with correct delta', () => {
    canvasListeners['mousedown']({ clientX: 100, clientY: 200 });
    canvasListeners['mousemove']({ clientX: 150, clientY: 260 });
    expect(global.setRotation).toHaveBeenCalledWith(50, 60);
  });

  test('mousemove without prior mousedown does not call setRotation', () => {
    // Reset dragging by simulating a mouseup first
    canvasListeners['mouseup']();
    canvasListeners['mousemove']({ clientX: 200, clientY: 300 });
    expect(global.setRotation).not.toHaveBeenCalled();
  });

  test('mouseup ends drag — subsequent mousemove is ignored', () => {
    canvasListeners['mousedown']({ clientX: 0, clientY: 0 });
    canvasListeners['mouseup']();
    canvasListeners['mousemove']({ clientX: 50, clientY: 50 });
    expect(global.setRotation).not.toHaveBeenCalled();
  });

  test('delta is cumulative across successive mousemove calls', () => {
    canvasListeners['mousedown']({ clientX: 0, clientY: 0 });
    canvasListeners['mousemove']({ clientX: 10, clientY: 20 });
    canvasListeners['mousemove']({ clientX: 25, clientY: 30 });
    expect(global.setRotation).toHaveBeenNthCalledWith(1, 10, 20);
    expect(global.setRotation).toHaveBeenNthCalledWith(2, 15, 10);
  });
});

describe('interaction: mouse wheel zoom', () => {
  beforeEach(() => jest.clearAllMocks());

  test('scroll down (positive deltaY) calls setZoom with factor < 1 (zoom out)', () => {
    canvasListeners['wheel']({ deltaY: 120, preventDefault: jest.fn() });
    expect(global.setZoom).toHaveBeenCalledWith(0.95);
  });

  test('scroll up (negative deltaY) calls setZoom with factor > 1 (zoom in)', () => {
    canvasListeners['wheel']({ deltaY: -120, preventDefault: jest.fn() });
    expect(global.setZoom).toHaveBeenCalledWith(1.05);
  });

  test('wheel event calls preventDefault to suppress page scroll', () => {
    const preventDefault = jest.fn();
    canvasListeners['wheel']({ deltaY: 1, preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });
});

describe('interaction: keyboard navigation', () => {
  beforeEach(() => jest.clearAllMocks());

  test('ArrowLeft calls setRotation with negative dx', () => {
    windowListeners['keydown']({ key: 'ArrowLeft' });
    expect(global.setRotation).toHaveBeenCalledWith(-15, 0);
  });

  test('ArrowRight calls setRotation with positive dx', () => {
    windowListeners['keydown']({ key: 'ArrowRight' });
    expect(global.setRotation).toHaveBeenCalledWith(15, 0);
  });

  test('ArrowUp calls setRotation with negative dy', () => {
    windowListeners['keydown']({ key: 'ArrowUp' });
    expect(global.setRotation).toHaveBeenCalledWith(0, -15);
  });

  test('ArrowDown calls setRotation with positive dy', () => {
    windowListeners['keydown']({ key: 'ArrowDown' });
    expect(global.setRotation).toHaveBeenCalledWith(0, 15);
  });

  test('+ key calls setZoom > 1 (zoom in)', () => {
    windowListeners['keydown']({ key: '+' });
    expect(global.setZoom).toHaveBeenCalledWith(1.1);
  });

  test('= key also zooms in', () => {
    windowListeners['keydown']({ key: '=' });
    expect(global.setZoom).toHaveBeenCalledWith(1.1);
  });

  test('- key calls setZoom < 1 (zoom out)', () => {
    windowListeners['keydown']({ key: '-' });
    expect(global.setZoom).toHaveBeenCalledWith(0.9);
  });

  test('_ key also zooms out', () => {
    windowListeners['keydown']({ key: '_' });
    expect(global.setZoom).toHaveBeenCalledWith(0.9);
  });

  test('0 key resets zoom to 1', () => {
    global.zoom = 3;
    windowListeners['keydown']({ key: '0' });
    expect(global.zoom).toBe(1);
  });

  test('unrecognised key does not call setRotation or setZoom', () => {
    windowListeners['keydown']({ key: 'a' });
    expect(global.setRotation).not.toHaveBeenCalled();
    expect(global.setZoom).not.toHaveBeenCalled();
  });
});

describe('interaction: touch drag (single finger)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('touchmove after touchstart calls setRotation with correct delta', () => {
    canvasListeners['touchstart']({
      preventDefault: jest.fn(),
      touches: [{ clientX: 50, clientY: 100 }],
    });
    canvasListeners['touchmove']({
      preventDefault: jest.fn(),
      touches: [{ clientX: 80, clientY: 130 }],
    });
    expect(global.setRotation).toHaveBeenCalledWith(30, 30);
  });
});

describe('interaction: pinch-to-zoom (two fingers)', () => {
  beforeEach(() => jest.clearAllMocks());

  test('pinch-in (decreasing distance) calls setZoom with factor < 1', () => {
    canvasListeners['touchstart']({
      preventDefault: jest.fn(),
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 100, clientY: 0 },
      ],
    });
    canvasListeners['touchmove']({
      preventDefault: jest.fn(),
      touches: [
        { clientX: 10, clientY: 0 },
        { clientX: 90, clientY: 0 },
      ],
    });
    // new dist = 80, old dist = 100 → factor = 0.8
    expect(global.setZoom).toHaveBeenCalled();
    const factor = global.setZoom.mock.calls[0][0];
    expect(factor).toBeCloseTo(0.8);
  });

  test('pinch-out (increasing distance) calls setZoom with factor > 1', () => {
    canvasListeners['touchstart']({
      preventDefault: jest.fn(),
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 50, clientY: 0 },
      ],
    });
    canvasListeners['touchmove']({
      preventDefault: jest.fn(),
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 100, clientY: 0 },
      ],
    });
    // new dist = 100, old dist = 50 → factor = 2.0
    expect(global.setZoom).toHaveBeenCalled();
    const factor = global.setZoom.mock.calls[0][0];
    expect(factor).toBeCloseTo(2.0);
  });

  test('touchend resets pinch distance', () => {
    canvasListeners['touchend']();
    // No assertion on setZoom — just verifies no crash
    expect(true).toBe(true);
  });
});
