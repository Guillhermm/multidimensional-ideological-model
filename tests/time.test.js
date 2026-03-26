// Provide DOM element mocks that time.js sets properties on at load time
const mockTimeSlider = { min: 0, max: 0, value: 0, oninput: null };
const mockYearLabel = { innerText: '' };
const mockAutoPlay = { onclick: null };

global.document = {
  getElementById: jest.fn().mockImplementation(id => {
    switch (id) {
      case 'timeSlider': return mockTimeSlider;
      case 'yearLabel': return mockYearLabel;
      case 'autoPlay': return mockAutoPlay;
      default: return null;
    }
  }),
};

const { minYear, maxYear } = require('../public/scripts/time');

describe('time constants', () => {
  test('minYear is 1789 (French Revolution)', () => {
    expect(minYear).toBe(1789);
  });

  test('maxYear is the current calendar year', () => {
    expect(maxYear).toBe(new Date().getFullYear());
  });

  test('maxYear is greater than minYear', () => {
    expect(maxYear).toBeGreaterThan(minYear);
  });

  test('the simulation spans at least 200 years', () => {
    expect(maxYear - minYear).toBeGreaterThan(200);
  });
});

describe('time slider initialisation', () => {
  test('slider min is set to minYear', () => {
    expect(mockTimeSlider.min).toBe(minYear);
  });

  test('slider max is set to maxYear', () => {
    expect(mockTimeSlider.max).toBe(maxYear);
  });

  test('slider initial value is maxYear (starts at present)', () => {
    expect(Number(mockTimeSlider.value)).toBe(maxYear);
  });

  test('slider oninput handler is registered', () => {
    expect(typeof mockTimeSlider.oninput).toBe('function');
  });
});

describe('year label initialisation', () => {
  test('year label is initialised to current year', () => {
    expect(Number(mockYearLabel.innerText)).toBe(maxYear);
  });
});

describe('auto-play control', () => {
  test('autoPlay button onclick handler is registered', () => {
    expect(typeof mockAutoPlay.onclick).toBe('function');
  });
});

describe('time slider oninput handler', () => {
  test('updating slider value changes the displayed year', () => {
    mockTimeSlider.value = '1917';
    mockTimeSlider.oninput();
    expect(Number(mockYearLabel.innerText)).toBe(1917);
  });

  test('updating slider value to minYear is reflected in label', () => {
    mockTimeSlider.value = String(minYear);
    mockTimeSlider.oninput();
    expect(Number(mockYearLabel.innerText)).toBe(minYear);
  });
});
