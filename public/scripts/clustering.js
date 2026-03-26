const normalizeCoords = v => {
  const len = Math.hypot(v.x, v.y, v.z);
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len
  };
};

const kMeans = (points, k = 3, iterations = 6) => {
  if (points.length < k) return [];

  let centroids = points.slice(0, k).map(p => normalizeCoords({ ...p }));

  for (let it = 0; it < iterations; it++) {
    const groups = Array.from({ length: k }, () => []);

    points.forEach(p => {
      let best = 0;
      let bestDist = Infinity;

      centroids.forEach((c, i) => {
        // distância angular
        const d = 1 - (p.x * c.x + p.y * c.y + p.z * c.z);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      groups[best].push(p);
    });

    centroids = groups.map(g => {
      if (!g.length) return { x: 0, y: 0, z: 1 };

      const avg = {
        x: g.reduce((s, p) => s + p.x, 0) / g.length,
        y: g.reduce((s, p) => s + p.y, 0) / g.length,
        z: g.reduce((s, p) => s + p.z, 0) / g.length
      };

      return normalizeCoords(avg);
    });
  }

  return centroids;
};

if (typeof module !== 'undefined') module.exports = { normalizeCoords, kMeans };
