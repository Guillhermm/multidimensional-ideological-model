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

window.addEventListener('keydown', e => {
  // For rotation only.
  const step = 15;

  switch (e.key) {
    case 'ArrowLeft':
      setRotation(-step, 0);
      break;

    case 'ArrowRight':
      setRotation(step, 0);
      break;

    case 'ArrowUp':
      setRotation(0, -step);
      break;

    case 'ArrowDown':
      setRotation(0, step);
      break;

    case '+':
    case '=':
      setZoom(1.1);
      break;

    case '-':
    case '_':
      setZoom(0.9);
      break;

    case '0':
      zoom = 1;
      break;
  }
});