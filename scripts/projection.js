let ax = 0, ay = 0;
let zoom = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;

const setRotation = (dx, dy) => {
  ay += dx * 0.005;
  ax += dy * 0.005;
};

const setZoom = factor => {
  zoom *= factor;
  zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
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
  const scale = (radius * zoom) / (2 - p.z);
  return {
    x: cx() + p.x * scale,
    y: cy() - p.y * scale,
    scale,
    z: p.z
  };
};

const normalize = v => {
  const len = Math.hypot(v.x, v.y, v.z);
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len
  };
};

// Camera spotlight
const lightDir = normalize({ x: 0, y: 0, z: 1 });

const rgbFromCoord = (x, y, z) => {
  // Base color
  const r = ((x + 1) / 2);
  const g = ((y + 1) / 2);
  const b = ((z + 1) / 2);

  // Sphere normal (it is already unitary)
  const nx = x;
  const ny = y;
  const nz = z;

  // Light intensity (dot product)
  let intensity =
    nx * lightDir.x +
    ny * lightDir.y +
    nz * lightDir.z;

  intensity = Math.max(0, intensity); // removes negative dark side

  // Minimum environment light
  const ambient = 0.2;

  intensity = ambient + intensity * (1 - ambient);

  return `rgb(${(r * intensity * 255) | 0},
              ${(g * intensity * 255) | 0},
              ${(b * intensity * 255) | 0})`;
};

if (typeof module !== 'undefined') module.exports = { setRotation, setZoom, rotate, project, normalize, rgbFromCoord };