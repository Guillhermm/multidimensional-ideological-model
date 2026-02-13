// Setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const cx = () => canvas.width / 2;
const cy = () => canvas.height / 2;

let ax = 0, ay = 0;
let dragging = false;
let lx, ly;

canvas.onmousedown = e => {
  dragging = true;
  lx = e.clientX;
  ly = e.clientY;
};

canvas.onmouseup = () => dragging = false;

canvas.onmousemove = e => {
  if (dragging) {
    ay += (e.clientX - lx) * .005;
    ax += (e.clientY - ly) * .005;
    lx = e.clientX;
    ly = e.clientY;
  }
};

const rotate = p => {
  let { x, y, z } = p;

  const cosY = Math.cos(ay), sinY = Math.sin(ay);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;

  const cosX = Math.cos(ax), sinX = Math.sin(ax);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;

  return { x: x1, y: y1, z: z2 };
};

const project = (p, r) => {
  const scale = r / (2 - p.z);
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

// 4th Dimension (Time)

const minYear = 1789;
const maxYear = new Date().getFullYear();

const timeSlider = document.getElementById('timeSlider');
const yearLabel = document.getElementById('yearLabel');
const gravitySlider = document.getElementById('gravitySlider');

timeSlider.min = minYear;
timeSlider.max = maxYear;
timeSlider.value = maxYear;

let currentYear = maxYear;
let auto = false;

timeSlider.oninput = () => {
  currentYear = parseInt(timeSlider.value);
  yearLabel.innerText = currentYear;
};

yearLabel.innerText = currentYear;

document.getElementById('autoPlay').onclick = () => {
  auto = !auto;
};

// User

const xSlider = document.getElementById('xSlider');
const ySlider = document.getElementById('ySlider');
const zSlider = document.getElementById('zSlider');

const getUser = () => {
  let x = parseFloat(xSlider.value);
  let y = parseFloat(ySlider.value);
  let z = parseFloat(zSlider.value);

  const len = Math.sqrt(x * x + y * y + z * z);
  if (len > 1) {
    x /= len; y /= len; z /= len;
  }

  return { name: 'You', x, y, z };
};

// Historical Events (Strengths)

const events = [
  { year: 1789, x: -0.4, y: -0.6, z: -0.2, strength: 0.8 }, // French Revolution
  { year: 1917, x: -0.9, y: 0.8, z: -0.3, strength: 1.0 },  // Russian Revolution
  { year: 1933, x: 0.8, y: 1, z: 1, strength: 1.2 },        // Nazism
  { year: 1945, x: 0, y: -0.2, z: -0.3, strength: 0.6 },    // Post War
  { year: 1989, x: 0.6, y: -0.5, z: -0.6, strength: 0.7 },  // USSR Collapse
  { year: 2008, x: -0.2, y: 0.3, z: 0.1, strength: 0.5 }    // Financial Crisis
];

// Complete Ideologies

const baseIdeologies = [
  ['Classical Liberalism', 0.6, -0.5, -0.6, 1776],
  ['Neoliberalism', 0.75, -0.35, -0.6, 1970],
  ['Libertarianism', 0.9, -0.9, -0.8, 1940],
  ['Anarcho-Capitalism', 1, -1, -0.7, 1950],
  ['Anarchism', -0.95, -0.9, -0.4, 1860],
  ['Social Democracy', -0.3, -0.15, -0.5, 1860],
  ['Eco-Socialism', -0.75, -0.35, -0.75, 1970],
  ['Stalinism', -0.85, 0.8, -0.1, 1924],
  ['Maoism', -0.9, 0.7, -0.2, 1943],
  ['Trotskyism', -0.85, 0.6, -0.5, 1920],
  ['Fascism', 0.7, 0.85, 0.9, 1919],
  ['Nazism', 0.8, 0.9, 0.95, 1920],
  ['Conservatism', 0.5, 0.2, 0.7, 1800],
  ['Neoconservatism', 0.6, 0.4, 0.7, 1940],
  ['Nationalism', 0.35, 0.4, 0.9, 1800],
  ['Technocracy', 0.25, 0.55, -0.1, 1920],
  ['Populism', 0.15, 0.65, 0.55, 1930],
  ['Monarchism', 0.55, 0.7, 0.75, 1700],
  ['Theocracy', 0.4, 0.9, 0.85, 1600],
  ['Municipalism', -0.65, -0.75, -0.45, 1980],
];

const ideologies = baseIdeologies.map(i => ({
  name: i[0],
  base: { x: i[1], y: i[2], z: i[3] },
  startYear: i[4],
  x: i[1],
  y: i[2],
  z: i[3],
  trail: []
}));

// Historical Physics

const applyHistoricalForces = (ideo) => {
  let gx = 0, gy = 0, gz = 0;
  const gravity = parseFloat(gravitySlider.value);

  events.forEach(e => {
    const timeDist = Math.abs(currentYear - e.year);
    if (timeDist < 60) {

      const influence = (1 - timeDist / 60) * e.strength * gravity;

      gx += (e.x - ideo.base.x) * influence;
      gy += (e.y - ideo.base.y) * influence;
      gz += (e.z - ideo.base.z) * influence;
    }
  });

  ideo.x = ideo.base.x + gx;
  ideo.y = ideo.base.y + gy;
  ideo.z = ideo.base.z + gz;

  const len = Math.sqrt(ideo.x ** 2 + ideo.y ** 2 + ideo.z ** 2);
  if (len > 1) {
    ideo.x /= len;
    ideo.y /= len;
    ideo.z /= len;
  }
};

// Continuous RGB Field

const drawSphereGradient = (radius) => {
  for (let i = 0; i < 2500; i++) {

    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    const rot = rotate({ x, y, z });
    const proj = project(rot, radius);

    ctx.fillStyle = rgbFromCoord(x, y, z)
      .replace('rgb', 'rgba')
      .replace(')', ', .10)');

    ctx.fillRect(proj.x, proj.y, 2, 2);
  }

  ctx.beginPath();
  ctx.arc(cx(), cy(), radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, .15)';
  ctx.stroke();
};

// Axes

const drawAxes = (radius) => {
  const axes = [
    { x: 1, y: 0, z: 0, color: 'red' },
    { x: 0, y: 1, z: 0, color: 'green' },
    { x: 0, y: 0, z: 1, color: 'blue' }
  ];

  axes.forEach(a => {
    const p = project(rotate(a), radius);
    ctx.strokeStyle = a.color;
    ctx.beginPath();
    ctx.moveTo(cx(), cy());
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
};

// ============================
// K-MEANS CLUSTERING
// ============================

const kMeans = (points, k = 3, iterations = 5) => {
  if (points.length < k) return [];

  let centroids = points.slice(0, k).map(p => ({ ...p }));

  for (let it = 0; it < iterations; it++) {

    let groups = Array.from({ length: k }, () => []);

    points.forEach(p => {
      let best = 0;
      let bestDist = Infinity;

      centroids.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2 + (p.z - c.z) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      groups[best].push(p);
    });

    centroids = groups.map(g => {
      if (g.length === 0) return { x: 0, y: 0, z: 0 };
      return {
        x: g.reduce((s, p) => s + p.x, 0) / g.length,
        y: g.reduce((s, p) => s + p.y, 0) / g.length,
        z: g.reduce((s, p) => s + p.z, 0) / g.length
      };
    });
  }

  return centroids;
};

// Export PNG

document.getElementById('exportPNG').onclick = () => {
  const link = document.createElement('a');
  link.download = 'ideological-model-screenshot.png';
  link.href = canvas.toDataURL();
  link.click();
};

// Main Loop

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (auto) {
    currentYear += .3;
    if (currentYear > maxYear) currentYear = minYear;
    timeSlider.value = currentYear;
    yearLabel.innerText = Math.floor(currentYear);
  }

  const baseRadius = 260;
  const user = getUser();
  const radical = Math.sqrt(user.x ** 2 + user.y ** 2 + user.z ** 2);
  const radius = baseRadius + radical * 40;

  drawSphereGradient(radius);
  drawAxes(radius);

  // Apply historical forces
  ideologies.forEach(i => {
    if (currentYear >= i.startYear) {
      applyHistoricalForces(i);
      i.trail.push({ x: i.x, y: i.y, z: i.z });
      if (i.trail.length > 80) i.trail.shift();
    }
  });

  const active = ideologies.filter(i => currentYear >= i.startYear);

  // Trails
  active.forEach(i => {
    ctx.beginPath();
    i.trail.forEach((p, index) => {
      const rot = rotate(p);
      const proj = project(rot, radius);

      if (index === 0) ctx.moveTo(proj.x, proj.y);
      else ctx.lineTo(proj.x, proj.y);
    });
    ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
    ctx.stroke();
  });

  // Real clusters
  const centroids = kMeans(active, 3);

  centroids.forEach(c => {
    const rot = rotate(c);
    const proj = project(rot, radius);
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
  });

  const all = [...active, user];

  const projected = all.map(p => {
    const rot = rotate(p);
    const proj = project(rot, radius);
    return { ...p, ...proj };
  }).sort((a, b) => a.z - b.z);

  projected.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, (6 * p.scale) / radius, 0, Math.PI * 2);

    ctx.fillStyle = p.name === 'You'
      ? 'magenta'
      : rgbFromCoord(p.x, p.y, p.z);

    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.fillText(p.name, p.x + 6, p.y);
  });

  // Proximity
  const nearest = active
    .map(i => {
      const d = Math.sqrt(
        (i.x - user.x) ** 2 +
        (i.y - user.y) ** 2 +
        (i.z - user.z) ** 2
      );
      return { name: i.name, d };
    })
    .sort((a, b) => a.d - b.d)[0];

  document.querySelector('.info .year').innerHTML = Math.floor(currentYear);
  document.querySelector('.info .radicality').innerHTML = radical.toFixed(2);
  document.querySelector('.info .nearest').innerHTML = (nearest ? nearest.name + " (" + nearest.d.toFixed(2) + ")" : "—");

  requestAnimationFrame(animate);
}

animate();