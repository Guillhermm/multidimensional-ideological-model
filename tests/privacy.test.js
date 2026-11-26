const { scrubAnalyticsEvent } = require('../public/scripts/privacy');

describe('scrubAnalyticsEvent', () => {
  test('drops query and fragment but keeps the path', () => {
    const e = scrubAnalyticsEvent({ type: 'pageview', url: 'https://mim.zenus.systems/tool?x=1#x=0.4&y=0&z=0&from=quiz' });
    expect(e.url).toBe('https://mim.zenus.systems/tool');
  });

  test('keeps the other event fields', () => {
    const e = scrubAnalyticsEvent({ type: 'pageview', url: 'https://a.test/quiz#x=1', payload: { p: 1 } });
    expect(e).toMatchObject({ type: 'pageview', payload: { p: 1 } });
  });
});
