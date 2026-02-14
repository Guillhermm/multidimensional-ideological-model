# Multidimensional Ideological Model

This project is an interactive **3D ideological sphere** that allows users to explore political ideologies along multiple dimensions. Beyond traditional left-right spectrums, this tool incorporates:

**1. Three ideological axes** (RGB mapping):

- X-axis (red): economic dimension, from left to right
- Y-axis (green): social/political engagement
- Z-axis (blue): authority/liberty or state involvement

**2. Historical evolution**:

- Ideologies are influenced by historical events (e.g., revolutions, political shifts, economic crises).
- A time slider allows users to move between 1789 (French Revolution) and the current year.
- Each ideology leaves a trail showing its movement over time.

**3. User input**:

- Users can define their position in 3D ideological space via sliders.
- The system calculates proximity to each ideology dynamically.

**4. Clustering**:

- Active ideologies are grouped using a simple k-means clustering algorithm.
- Centroids are displayed to give a sense of major ideological “poles.”

**5. Visualization**:

- A continuous RGB sphere provides a visual background of ideological space.
- Ideologies and user positions are projected into 2D using a simple perspective model.
- Trails, clusters, and proximity calculations are updated in real-time.

---

## Current Features

- Interactive 3D sphere with drag-to-rotate functionality.
- Time control slider for observing historical evolution.
- User position sliders to place yourself in the ideological space.
- Automatic animation of historical movement.
- Historical events influence, including strength and proximity decay.
- Clustering of active ideologies.
- Trail visualization of ideological evolution.
- Export current canvas as PNG.
- Fully functional without a server (works with `file://`).
- Uses modern ES6 syntax (arrow functions, template literals, const/let).

---

## Installation / Usage

**1.** Clone the repository:

```bash
git clone https://github.com/yourusername/multidimensional-ideological-model.git
```

**2.** `Open index.html` directly in a modern browser (Chrome, Firefox, Edge). No server setup is required.

**3.** Adjust sliders for X, Y, Z coordinates (user ideology), time, and historical gravity.

**4.** Drag on the canvas to rotate the sphere.

---

## Planned Features

**1. Multilingual support**

- Current interface in English, but long-term plan is to support other languages.

**2. Expanded ideological dataset**

- Add smaller and niche political movements.
- Add a richer historical timeline with multiple events per ideology.

**3. Advanced visualization**

- Optional 4th dimension (time) represented via color, opacity, or trail density.
- Allow toggling “historical gravity” on/off per event.

**4. Academic integration**

- Provide metrics for “proximity” between user position and ideological clusters.
- Allow exporting dataset for research purposes.

**5. CodePen / GitHub Pages version**

- Fully online, interactive version without server setup.

**6. Future modularization**

- With ES6 modules and/or Webpack/Bundler for better maintainability.
- Optional use of WebGL or three.js for smoother rendering.

---

## Contributing

Contributions are welcome!

If you want to:

- Add new ideologies or events
- Improve UI/UX
- Enhance historical modeling
- Add documentation or translations

Please submit a pull request or open an issue to discuss.

---

## Notes

- This project is primarily a computational experiment to explore ideological spaces.
- It is not intended to classify individuals, but to visualize complex relationships between ideologies over time.
- Historical influence ("gravitational forces") is simplified for visualization purposes; it is not a precise historical model.

---

**Author:** Guilherme Almeida Zeni
**License:** MIT
**Repository:** multidimensional-ideological-model