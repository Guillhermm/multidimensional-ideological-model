let dragging = false;
let lx, ly;
let lastPinchDist = null;

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

// Touch support
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    lx = e.touches[0].clientX;
    ly = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    lastPinchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    setRotation(e.touches[0].clientX - lx, e.touches[0].clientY - ly);
    lx = e.touches[0].clientX;
    ly = e.touches[0].clientY;
    lastPinchDist = null;
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    if (lastPinchDist) setZoom(dist / lastPinchDist);
    lastPinchDist = dist;
  }
}, { passive: false });

canvas.addEventListener('touchend', () => { lastPinchDist = null; }, { passive: false });