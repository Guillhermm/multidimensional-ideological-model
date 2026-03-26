const drawSphereGradient = radius => {
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

    ctx.fillStyle = rgbFromCoord(x, y, z).replace('rgb', 'rgba').replace(')', ', .10)');
    ctx.fillRect(proj.x, proj.y, 2, 2);
  }

  ctx.beginPath();
  ctx.arc(cx(), cy(), radius * .75, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, .15)';
  ctx.stroke();
};

const drawAxes = radius => {
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

if (typeof module !== 'undefined') module.exports = { drawSphereGradient, drawAxes };
