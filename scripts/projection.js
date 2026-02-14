let ax = 0, ay = 0;

const setRotation = (dx, dy) => {
  ay += dx * 0.005;
  ax += dy * 0.005;
};

const rotate = p => {
  const { x, y, z } = p;
  const cosY = Math.cos(ay), sinY = Math.sin(ay);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const cosX = Math.cos(ax), sinX = Math.sin(ax);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  return { x: x1, y: y1, z: z2 };
};

const project = (p, radius) => {
  const scale = radius / (2 - p.z);
  return {
    x: cx() + p.x * scale,
    y: cy() - p.y * scale,
    scale,
    z: p.z
  };
};

const rgbFromCoord = (x, y, z) => {
  const r = ((x + 1) / 2) * 255;
  const g = ((y + 1) / 2) * 255;
  const b = ((z + 1) / 2) * 255;
  return `rgb(${r | 0},${g | 0},${b | 0})`;
};
