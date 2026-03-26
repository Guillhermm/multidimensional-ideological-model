# Multidimensional Ideological Model

**Live:** [multidimensional-ideological-model.vercel.app](https://multidimensional-ideological-model.vercel.app)
**Repository:** [github.com/Guillhermm/multidimensional-ideological-model](https://github.com/Guillhermm/multidimensional-ideological-model)

An interactive 3D visualization of political ideologies as unit vectors in continuous Euclidean space, animated across 400 years of history and shaped by gravitational historical forces.

Built with Astro 5 + Tailwind CSS v4. Zero runtime dependencies on the visualization layer — pure HTML5 Canvas and ES6 JavaScript.

---

## Model

Each ideology is a vector **v** = (x, y, z) ∈ [−1, 1]³ on the unit sphere S², with three orthogonal axes:

| Axis | Dimension | −1 | +1 |
|------|-----------|-----|-----|
| X | Economic | Collective / Left | Private / Right |
| Y | Authority | Libertarian / Free | Authoritarian / Order |
| Z | Identity | Cosmopolitan / Progressive | Nationalist / Traditional |

Historical events (French Revolution, Russian Revolution, Rise of Fascism, WWII, Fall of Berlin Wall, 2008 Crisis) act as gravitational forces that displace ideologies within a 60-year temporal window. Ideologies also attract and repel each other through a dot-product interaction term.

---

## Features

- **20 political ideologies** spanning 1600–present, positioned as vectors in 3D space
- **Time slider** animating ideological drift from 1789 to the current year
- **Historical gravity** — tune the strength of historical event forces (0–2×)
- **Spherical k-means clustering** (k=3) revealing dominant ideological coalitions in real time
- **15-question positioning quiz** mapping your answers to coordinates via Likert scale
- **User position** — place yourself via quiz or manual X/Y/Z sliders; nearest ideology computed dynamically
- **Radicality metric** — Euclidean distance from origin (0 = centrist, 1 = maximally radical)
- **System instability metric** — mean velocity of active ideologies per frame
- **Trail visualization** — each ideology stores its last 80 positions
- **PNG export** of the current canvas state
- **Mobile support** — touch drag-to-rotate, bottom-sheet controls panel
- **PWA** — installable, offline-capable via Service Worker
- **Keyboard navigation** — arrow keys to rotate, +/− to zoom, 0 to reset

---

## Stack

| Layer | Technology |
|-------|-----------|
| Site framework | Astro 5 (static output) |
| Styling | Tailwind CSS v4 |
| Visualization | HTML5 Canvas, ES6 modules |
| Testing | Jest 29 + Babel |
| CI/CD | GitHub Actions → Vercel (tag-based) |

---

## Project Structure

```
src/
  layouts/Layout.astro      # Shared nav, footer, PWA, OG meta
  pages/
    index.astro             # Landing page
    tool.astro              # 3D visualization tool
    quiz.astro              # 15-question positioning quiz
    about.astro             # Author, timeline, math summary, references

public/scripts/
  core.js                   # Canvas setup, state, animation loop
  data.js                   # Ideology coordinates and historical events
  physics.js                # Historical gravity and inter-ideology interaction
  clustering.js             # Spherical k-means (cosine distance, k=3)
  projection.js             # Euler rotation + perspective projection
  rendering.js              # Phong-shaded sphere, trails, labels, UI
  interaction.js            # Mouse/touch drag, scroll zoom, keyboard
  time.js                   # Time slider, auto-play, year label
  main.js                   # Entry point, wires all modules

docs/
  ACADEMICAL_DOCUMENTATION.md   # Full mathematical formalism
  TECHNICAL_DOCUMENTATION.md    # Implementation details

tests/
  clustering.test.js
  data.test.js
  physics.test.js
  projection.test.js
```

---

## Getting Started

```bash
git clone https://github.com/Guillhermm/multidimensional-ideological-model.git
cd multidimensional-ideological-model
npm install
npm run dev        # local dev server (Astro)
npm test           # run Jest test suite
npm run build      # static build → dist/
```

---

## CI/CD

**Any branch push / PR** → runs the test suite only. Vercel automatically deploys any changes merged to `main` branch.


---

## Planned

- Expand the ideology and events dataset (more ideologies, richer historical timeline)
- Multilingual support
- Empirical coordinate validation against Chapel Hill Expert Survey / Manifesto Project data
- Gaussian decay option for historical forces
- Psychometric validation of the 15-item quiz

---

## Academic Context

The model is grounded in:
- Spatial political modeling (Poole & Rosenthal, 1985; Downs, 1957)
- Multidimensional ideology research (Ramaciotti et al., 2024; Abramowitz & Webster, 2025)
- Sociophysics and opinion dynamics (Castellano et al., 2009; Diaz & Monteiro, 2023)

A formal preprint is being prepared alongside this implementation.

Full mathematical documentation: [docs/ACADEMICAL_DOCUMENTATION.md](docs/ACADEMICAL_DOCUMENTATION.md)

---

**Author:** Guilherme Almeida Zeni — IMECC / Unicamp, Brazil
**License:** MIT
