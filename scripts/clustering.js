const kMeans = (points, k = 3, iterations = 5) => {
  if (points.length < k) return [];

  let centroids = points.slice(0, k).map(p => ({ ...p }));

  for (let it = 0; it < iterations; it++) {
    const groups = Array.from({ length: k }, () => []);

    points.forEach(p => {
      let best = 0, bestDist = Infinity;
      centroids.forEach((c, i) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2 + (p.z - c.z) ** 2;
        if (d < bestDist) { bestDist = d; best = i; }
      });
      groups[best].push(p);
    });

    centroids = groups.map(g => {
      if (!g.length) return { x: 0, y: 0, z: 0 };
      return {
        x: g.reduce((s, p) => s + p.x, 0) / g.length,
        y: g.reduce((s, p) => s + p.y, 0) / g.length,
        z: g.reduce((s, p) => s + p.z, 0) / g.length
      };
    });
  }

  return centroids;
};
