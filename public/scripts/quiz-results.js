const axisBarModel = value => ({
  text: `${value > 0 ? '+' : ''}${value.toFixed(3)}`,
  widthPct: Math.abs(value) * 50,
  side: value >= 0 ? 'left' : 'right',
});

const node = (doc, tag, css, text) => {
  const n = doc.createElement(tag);
  n.style.cssText = css;
  if (text !== undefined) n.textContent = text;
  return n;
};

const buildAxisBar = (doc, label, value, color) => {
  const m = axisBarModel(value);

  const head = node(doc, 'div', 'margin-bottom:0.25rem;display:flex;justify-content:space-between;align-items:center;');
  head.append(
    node(doc, 'span', `font-size:0.8rem;font-weight:600;color:${color};`, label),
    node(doc, 'span', 'font-size:0.8rem;font-family:var(--font-mono);color:var(--color-text);', m.text),
  );

  const track = node(doc, 'div', 'height:0.5rem;background:var(--color-border);border-radius:9999px;position:relative;margin-bottom:0.5rem;');
  track.append(
    node(doc, 'div', 'position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--color-muted);opacity:0.3;'),
    node(doc, 'div', `height:100%;width:${m.widthPct}%;background:${color};border-radius:9999px;position:absolute;${m.side}:50%;`),
  );

  return [head, track];
};

const buildNearest = (doc, nearest) => [
  node(doc, 'div', 'font-size:0.75rem;color:var(--color-muted);margin-bottom:0.5rem;', 'Closest ideology'),
  node(doc, 'div', 'font-size:1.5rem;font-weight:700;margin-bottom:0.25rem;', nearest.name),
  node(doc, 'div', 'font-size:0.8rem;color:var(--color-muted);', `Distance: ${nearest.distance}`),
];

if (typeof module !== 'undefined') module.exports = { axisBarModel, buildAxisBar, buildNearest };
