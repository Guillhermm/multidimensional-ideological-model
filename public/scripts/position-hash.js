const clampUnit = v => Math.max(-1, Math.min(1, v));

// The position lives in the fragment because browsers never send it in a request.
const serializePosition = ({ x, y, z }, fromQuiz = true) =>
  `#x=${x}&y=${y}&z=${z}${fromQuiz ? '&from=quiz' : ''}`;

const parsePosition = hash => {
  const params = new URLSearchParams(String(hash || '').replace(/^#/, ''));
  const out = { fromQuiz: params.get('from') === 'quiz' };
  ['x', 'y', 'z'].forEach(axis => {
    if (!params.has(axis)) return;
    const v = parseFloat(params.get(axis));
    if (Number.isFinite(v)) out[axis] = clampUnit(v);
  });
  return out;
};

if (typeof module !== 'undefined') module.exports = { serializePosition, parsePosition };
