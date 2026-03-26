const { events, baseIdeologies, ideologies } = require('../scripts/data');

describe('events', () => {
  test('contains 6 historical events', () => {
    expect(events).toHaveLength(6);
  });

  test('each event has required fields', () => {
    events.forEach(e => {
      expect(e).toHaveProperty('year');
      expect(e).toHaveProperty('x');
      expect(e).toHaveProperty('y');
      expect(e).toHaveProperty('z');
      expect(e).toHaveProperty('strength');
    });
  });

  test('event years are in chronological order', () => {
    const years = events.map(e => e.year);
    const sorted = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sorted);
  });

  test('event coordinates are within [-1, 1] range', () => {
    events.forEach(e => {
      expect(e.x).toBeGreaterThanOrEqual(-1);
      expect(e.x).toBeLessThanOrEqual(1);
      expect(e.y).toBeGreaterThanOrEqual(-1);
      expect(e.y).toBeLessThanOrEqual(1);
      expect(e.z).toBeGreaterThanOrEqual(-1);
      expect(e.z).toBeLessThanOrEqual(1);
    });
  });

  test('event strength values are positive', () => {
    events.forEach(e => {
      expect(e.strength).toBeGreaterThan(0);
    });
  });
});

describe('baseIdeologies', () => {
  test('contains 20 ideologies', () => {
    expect(baseIdeologies).toHaveLength(20);
  });

  test('each entry has name, x, y, z, startYear', () => {
    baseIdeologies.forEach(i => {
      expect(typeof i[0]).toBe('string'); // name
      expect(typeof i[1]).toBe('number'); // x
      expect(typeof i[2]).toBe('number'); // y
      expect(typeof i[3]).toBe('number'); // z
      expect(typeof i[4]).toBe('number'); // startYear
    });
  });

  test('all ideology names are unique', () => {
    const names = baseIdeologies.map(i => i[0]);
    expect(new Set(names).size).toBe(names.length);
  });

  test('start years are plausible historical years', () => {
    baseIdeologies.forEach(i => {
      expect(i[4]).toBeGreaterThanOrEqual(1600);
      expect(i[4]).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });
});

describe('ideologies', () => {
  test('has same count as baseIdeologies', () => {
    expect(ideologies).toHaveLength(baseIdeologies.length);
  });

  test('each ideology has correct structure', () => {
    ideologies.forEach(i => {
      expect(i).toHaveProperty('name');
      expect(i).toHaveProperty('base');
      expect(i.base).toHaveProperty('x');
      expect(i.base).toHaveProperty('y');
      expect(i.base).toHaveProperty('z');
      expect(i).toHaveProperty('startYear');
      expect(i).toHaveProperty('x');
      expect(i).toHaveProperty('y');
      expect(i).toHaveProperty('z');
      expect(i).toHaveProperty('trail');
      expect(Array.isArray(i.trail)).toBe(true);
    });
  });

  test('initial position matches base position', () => {
    ideologies.forEach(i => {
      expect(i.x).toBe(i.base.x);
      expect(i.y).toBe(i.base.y);
      expect(i.z).toBe(i.base.z);
    });
  });

  test('trail starts empty', () => {
    ideologies.forEach(i => {
      expect(i.trail).toHaveLength(0);
    });
  });

  test('ideology names match baseIdeologies', () => {
    ideologies.forEach((ideo, idx) => {
      expect(ideo.name).toBe(baseIdeologies[idx][0]);
    });
  });
});
