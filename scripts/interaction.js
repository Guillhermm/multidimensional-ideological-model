let dragging = false;
let lx, ly;

canvas.addEventListener('mousedown', e => {
  dragging = true;
  lx = e.clientX;
  ly = e.clientY;
});

canvas.addEventListener('mouseup', () => dragging = false);

canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  setRotation(e.clientX - lx, e.clientY - ly);
  lx = e.clientX;
  ly = e.clientY;
});

canvas.addEventListener('wheel', e => {
  e.preventDefault();

  setZoom(e.deltaY > 0 ? 0.95 : 1.05);
});