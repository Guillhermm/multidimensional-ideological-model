const EXPORT_BACKGROUND = '#0d0d0d';

const exportFileName = (date = new Date()) => {
  const pad = n => String(n).padStart(2, '0');
  return `ideological-model-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}.png`;
};

// The live canvas is transparent (its dark background is CSS), so a raw
// export shows white labels on nothing. Paint the background in first.
const composeExport = (source, createCanvas, background = EXPORT_BACKGROUND) => {
  const out = createCanvas();
  out.width = source.width;
  out.height = source.height;
  const octx = out.getContext('2d');
  octx.fillStyle = background;
  octx.fillRect(0, 0, out.width, out.height);
  octx.drawImage(source, 0, 0);
  return out;
};

if (typeof module !== 'undefined') module.exports = { exportFileName, composeExport, EXPORT_BACKGROUND };
