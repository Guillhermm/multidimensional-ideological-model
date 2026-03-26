// const gravitySlider = document.getElementById('gravitySlider');

// const applyHistoricalForces = ideo => {
//   let gx = 0, gy = 0, gz = 0;
//   const gravity = parseFloat(gravitySlider.value);

//   events.forEach(e => {
//     const timeDist = Math.abs(currentYear - e.year);
//     if (timeDist < 60) {
//       const influence = (1 - timeDist / 60) * e.strength * gravity;
//       gx += (e.x - ideo.base.x) * influence;
//       gy += (e.y - ideo.base.y) * influence;
//       gz += (e.z - ideo.base.z) * influence;
//     }
//   });

//   ideo.x = ideo.base.x + gx;
//   ideo.y = ideo.base.y + gy;
//   ideo.z = ideo.base.z + gz;

//   const len = Math.sqrt(ideo.x ** 2 + ideo.y ** 2 + ideo.z ** 2);
//   if (len > 1) {
//     ideo.x /= len;
//     ideo.y /= len;
//     ideo.z /= len;
//   }
// };
const gravitySlider = document.getElementById('gravitySlider');

const applyHistoricalForces = ideo => {
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

  // 🔥 Interação entre ideologias (campo relacional)
  const interactionStrength = 0.015;

  const active = ideologies.filter(i => currentYear >= i.startYear);

  active.forEach(other => {
    if (other === ideo) return;

    const dot = ideo.x * other.x +
                ideo.y * other.y +
                ideo.z * other.z;

    const influence = interactionStrength * dot;

    ideo.x += (other.x - ideo.x) * influence;
    ideo.y += (other.y - ideo.y) * influence;
    ideo.z += (other.z - ideo.z) * influence;
  });

  // normalização
  const len = Math.sqrt(ideo.x ** 2 + ideo.y ** 2 + ideo.z ** 2);
  if (len > 1) {
    ideo.x /= len;
    ideo.y /= len;
    ideo.z /= len;
  }
};

if (typeof module !== 'undefined') module.exports = { applyHistoricalForces };
