const { axisBarModel, buildAxisBar, buildNearest } = require('../public/scripts/quiz-results');

const fakeDoc = () => ({
  createElement: tag => ({
    tag,
    style: {},
    children: [],
    textContent: '',
    append(...c) { this.children.push(...c); },
  }),
});

describe('axisBarModel', () => {
  test('positive values grow right from the center with a plus sign', () => {
    expect(axisBarModel(0.5)).toEqual({ text: '+0.500', widthPct: 25, side: 'left' });
  });

  test('negative values grow left from the center', () => {
    expect(axisBarModel(-1)).toEqual({ text: '-1.000', widthPct: 50, side: 'right' });
  });

  test('zero has no sign and no width', () => {
    expect(axisBarModel(0)).toEqual({ text: '0.000', widthPct: 0, side: 'left' });
  });
});

describe('buildAxisBar', () => {
  test('puts label and value in textContent, not markup', () => {
    const [head] = buildAxisBar(fakeDoc(), '<b>Economic</b>', 0.2, '#ef4444');
    expect(head.children[0].textContent).toBe('<b>Economic</b>');
    expect(head.children[1].textContent).toBe('+0.200');
  });

  test('returns the header row and the bar track', () => {
    const nodes = buildAxisBar(fakeDoc(), 'Z', -0.4, '#3b82f6');
    expect(nodes).toHaveLength(2);
    const fill = nodes[1].children[1];
    expect(fill.style.cssText).toContain('width:20%');
    expect(fill.style.cssText).toContain('right:50%');
  });
});

describe('buildNearest', () => {
  test('renders name and distance as text', () => {
    const nodes = buildNearest(fakeDoc(), { name: 'Maoism', distance: '0.42' });
    expect(nodes.map(n => n.textContent)).toEqual(['Closest ideology', 'Maoism', 'Distance: 0.42']);
  });
});
