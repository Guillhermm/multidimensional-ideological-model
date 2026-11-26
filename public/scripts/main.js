const xSlider = document.getElementById('xSlider');
const ySlider = document.getElementById('ySlider');
const zSlider = document.getElementById('zSlider');

const getUser = () => {
  let x = parseFloat(xSlider.value);
  let y = parseFloat(ySlider.value);
  let z = parseFloat(zSlider.value);

  const len = Math.sqrt(x * x + y * y + z * z);
  if (len > 1) { x /= len; y /= len; z /= len; }

  return { name: 'You', x, y, z };
};

document.getElementById('exportPNG').onclick = () => {
  const out = composeExport(canvas, () => document.createElement('canvas'));
  out.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = exportFileName();
    link.href = url;
    // Safari and Firefox ignore clicks on anchors that are not in the document.
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
};

if (typeof module !== 'undefined') module.exports = { getUser };

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (auto) {
    currentYear += 0.3;
    if (currentYear > maxYear) currentYear = minYear;
    timeSlider.value = currentYear;
    yearLabel.innerText = Math.floor(currentYear);
  }

  const baseRadius = Math.min(440, Math.min(canvas.width, canvas.height - viewInsetBottom) / 2);
  const user = getUser();
  const radical = Math.sqrt(user.x ** 2 + user.y ** 2 + user.z ** 2);
  const radius = baseRadius + radical * 40;

  drawSphereGradient(radius);
  drawAxes(radius);

  ideologies.forEach(i => {
    if (currentYear >= i.startYear) {
      applyHistoricalForces(i);
      if (i.prev) {
        const vx = i.x - i.prev.x;
        const vy = i.y - i.prev.y;
        const vz = i.z - i.prev.z;

        i.velocity = Math.sqrt(vx * vx + vy * vy + vz * vz);
      } else {
        i.velocity = 0;
      }

      i.prev = { x: i.x, y: i.y, z: i.z };

      i.trail.push({ x: i.x, y: i.y, z: i.z });
      if (i.trail.length > 80) i.trail.shift();
    }
  });

  const active = ideologies.filter(i => currentYear >= i.startYear);

  active.forEach(i => {
    ctx.beginPath();
    i.trail.forEach((p, index) => {
      const rot = rotate(p);
      const proj = project(rot, radius);
      index === 0 ? ctx.moveTo(proj.x, proj.y) : ctx.lineTo(proj.x, proj.y);
    });
    ctx.strokeStyle = 'rgba(255, 255, 255, .2)';
    ctx.stroke();
  });

  const centroids = kMeans(active, 3);
  centroids.forEach(c => {
    const rot = rotate(c);
    const proj = project(rot, radius);
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
  });

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

  const all = [...active, user];
  const projected = all.map(p => {
    const rot = rotate(p);
    const proj = project(rot, radius);
    return { ...p, ...proj };
  }).sort((a, b) => a.z - b.z);

  projected.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, (6 * p.scale) / radius, 0, Math.PI * 2);
    ctx.fillStyle = p.name === 'You' ? 'magenta' : rgbFromCoord(p.x, p.y, p.z);
    ctx.fill();
  });

  const pointed = nearestPoint(projected, typeof pointer === 'undefined' ? null : pointer, 18);
  const forced = new Set(['You']);
  if (nearest) forced.add(nearest.name);
  if (pointed) forced.add(pointed);

  ctx.fillStyle = '#fff';
  ctx.font = '11px Arial';
  layoutLabels(projected, {
    measure: name => ctx.measureText(name).width,
    forced,
    maxX: canvas.width,
  }).forEach(l => ctx.fillText(l.name, l.x, l.y));

  const avgVelocity =
    active.reduce((s, i) => s + i.velocity, 0) / active.length;

  document.querySelector('.info .year').textContent = Math.floor(currentYear);
  document.querySelector('.info .instability').textContent = avgVelocity.toFixed(4);
  document.querySelector('.info .radicality').textContent = radical.toFixed(2);
  document.querySelector('.info .nearest').textContent =
    nearest ? `${nearest.name} (${nearest.d.toFixed(2)})` : 'None';

  requestAnimationFrame(animate);
};

animate();
