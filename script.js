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

// Main Loop

const animate = () => {
  drawSphereGradient(260);
}

animate();