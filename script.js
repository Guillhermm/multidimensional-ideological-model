// Setup

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

// 4th Dimension (Time)

const minYear = 1789;
const maxYear = new Date().getFullYear();

const timeSlider = document.getElementById("timeSlider");
const yearLabel = document.getElementById("yearLabel");
const gravitySlider = document.getElementById("gravitySlider");

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

document.getElementById("autoPlay").onclick = () => {
  auto = !auto;
};