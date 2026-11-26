const LABEL_HEIGHT = 11;
const LABEL_OFFSET = 6;
const LABEL_PAD = 2;

const labelBox = (left, baseline, width) => ({
  left: left - LABEL_PAD,
  right: left + width + LABEL_PAD,
  top: baseline - LABEL_HEIGHT - LABEL_PAD,
  bottom: baseline + LABEL_PAD,
});

const boxesOverlap = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// Points nearer the camera (larger z) are placed first; names in `forced` are
// placed before everything else and are drawn even when they overlap.
const layoutLabels = (points, { measure, forced = new Set(), maxX = Infinity } = {}) => {
  const ordered = [...points].sort((a, b) => {
    const fa = forced.has(a.name) ? 1 : 0;
    const fb = forced.has(b.name) ? 1 : 0;
    return fb - fa || b.z - a.z;
  });

  const placed = [];

  ordered.forEach(p => {
    const width = measure(p.name);
    let left = p.x + LABEL_OFFSET;
    if (left + width + LABEL_PAD > maxX) left = p.x - LABEL_OFFSET - width;
    const box = labelBox(left, p.y, width);

    if (!forced.has(p.name) && placed.some(q => boxesOverlap(box, q.box))) return;
    placed.push({ name: p.name, x: left, y: p.y, box });
  });

  return placed;
};

const nearestPoint = (points, pointer, maxDist) => {
  if (!pointer) return null;
  let best = null;
  let bestDist = maxDist;
  points.forEach(p => {
    const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
    if (d <= bestDist) { bestDist = d; best = p.name; }
  });
  return best;
};

if (typeof module !== 'undefined') module.exports = { layoutLabels, nearestPoint, boxesOverlap, labelBox };
