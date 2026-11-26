// Vercel Web Analytics sends location.href with every page view. Strip the
// query and fragment so a position or any other state never reaches it.
const scrubAnalyticsEvent = event => {
  const url = new URL(event.url);
  url.search = '';
  url.hash = '';
  return { ...event, url: url.toString() };
};

if (typeof window !== 'undefined') window.webAnalyticsBeforeSend = scrubAnalyticsEvent;
if (typeof module !== 'undefined') module.exports = { scrubAnalyticsEvent };
