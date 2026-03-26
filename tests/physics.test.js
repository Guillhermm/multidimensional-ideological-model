// Mock DOM globals that physics.js needs
global.document = {
  getElementById: jest.fn()
};

const makeGravitySlider = (value = '1') => ({ value });

describe('applyHistoricalForces', () => {
  let applyHistoricalForces;

  const makeIdeology = (x, y, z, startYear = 1700) => ({
    name: 'Test',
    base: { x, y, z },
    startYear,
    x,
    y,
    z,
    trail: []
  });

  const makeEvent = (year, x, y, z, strength) => ({ year, x, y, z, strength });

  beforeEach(() => {
    jest.resetModules();
    global.document = { getElementById: jest.fn() };
  });

  test('position stays near base when no events are within 60-year window', () => {
    const gravitySlider = makeGravitySlider('1');
    global.document.getElementById.mockReturnValue(gravitySlider);
    global.events = [makeEvent(1789, -0.4, -0.6, -0.2, 0.8)];
    global.currentYear = 1900; // 111 years after 1789, outside 60-year window
    global.ideologies = [];

    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideo = makeIdeology(0.5, 0.5, 0.5);
    applyHistoricalForces(ideo);

    expect(ideo.x).toBeCloseTo(0.5);
    expect(ideo.y).toBeCloseTo(0.5);
    expect(ideo.z).toBeCloseTo(0.5);
  });

  test('event within 60-year window pulls ideology toward event coordinates', () => {
    jest.resetModules();
    const gravitySlider = makeGravitySlider('1');
    global.document.getElementById.mockReturnValue(gravitySlider);
    global.events = [makeEvent(1900, 1, 0, 0, 1)];
    global.currentYear = 1900; // exact year → full influence
    global.ideologies = [];

    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideo = makeIdeology(0, 0, 0);
    applyHistoricalForces(ideo);

    // Event is at x=1 and base is at x=0, so gx = (1-0)*1*1 = 1 → x moves toward 1
    expect(ideo.x).toBeGreaterThan(0);
  });

  test('higher gravity increases event influence', () => {
    // Use a partial time window (30 years away from event) so influence < 1 and clamping does not hide the difference.
    // influence = (1 - 30/60) * strength * gravity = 0.5 * 0.3 * gravity
    // base at (0,0,0): ideo.x = (event.x - 0) * influence = 0.5 * gravity * 0.3
    jest.resetModules();
    global.document.getElementById.mockReturnValueOnce(makeGravitySlider('2'));
    global.events = [makeEvent(1900, 0.5, 0, 0, 0.3)];
    global.currentYear = 1930; // 30 years after event
    global.ideologies = [];
    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideoHighGravity = makeIdeology(0, 0, 0);
    applyHistoricalForces(ideoHighGravity);

    jest.resetModules();
    global.document.getElementById.mockReturnValueOnce(makeGravitySlider('1'));
    global.events = [makeEvent(1900, 0.5, 0, 0, 0.3)];
    global.currentYear = 1930;
    global.ideologies = [];
    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideoLowGravity = makeIdeology(0, 0, 0);
    applyHistoricalForces(ideoLowGravity);

    expect(Math.abs(ideoHighGravity.x)).toBeGreaterThan(Math.abs(ideoLowGravity.x));
  });

  test('result is clamped to unit sphere (magnitude ≤ 1)', () => {
    jest.resetModules();
    const gravitySlider = makeGravitySlider('10'); // very strong
    global.document.getElementById.mockReturnValue(gravitySlider);
    global.events = [makeEvent(1900, 1, 1, 1, 2)];
    global.currentYear = 1900;
    global.ideologies = [];

    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideo = makeIdeology(0.5, 0.5, 0.5);
    applyHistoricalForces(ideo);

    const len = Math.sqrt(ideo.x ** 2 + ideo.y ** 2 + ideo.z ** 2);
    expect(len).toBeLessThanOrEqual(1 + 1e-9);
  });

  test('inactive ideologies (startYear > currentYear) are excluded from interactions', () => {
    jest.resetModules();
    const gravitySlider = makeGravitySlider('0'); // disable historical events
    global.document.getElementById.mockReturnValue(gravitySlider);
    global.events = [];
    global.currentYear = 1800;
    const futureIdeology = makeIdeology(-1, 0, 0, 1900); // not yet active
    const subjectIdeology = makeIdeology(0.5, 0, 0, 1700);
    global.ideologies = [subjectIdeology, futureIdeology];

    ({ applyHistoricalForces } = require('../scripts/physics'));
    const before = { x: subjectIdeology.x, y: subjectIdeology.y, z: subjectIdeology.z };
    applyHistoricalForces(subjectIdeology);

    // future ideology should not affect the subject
    expect(subjectIdeology.x).toBeCloseTo(before.x);
  });

  test('zero gravity produces no historical event displacement', () => {
    jest.resetModules();
    global.document.getElementById.mockReturnValue(makeGravitySlider('0'));
    global.events = [makeEvent(1900, 1, 0, 0, 1)];
    global.currentYear = 1900;
    global.ideologies = [];

    ({ applyHistoricalForces } = require('../scripts/physics'));
    const ideo = makeIdeology(0.5, 0, 0);
    applyHistoricalForces(ideo);

    expect(ideo.x).toBeCloseTo(0.5);
  });
});
