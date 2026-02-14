# Multidimensional Ideological Model Technical Documentation

The Multidimensional Ideological Model is an interactive simulation of political ideologies in a continuous 3D space, extended with temporal dynamics. Unlike conventional 1D (left-right) or 2D (axes like "economic vs social") political diagrams, this model attempts to capture ideologies along three core dimensions:

- X-axis (economic dimension): $x \in [-1, 1]$
- Y-axis (social/political engagement): $y \in [-1, 1]$
- Z-axis (state involvement / governance): $z \in [-1, 1]$

The model also introduces historical forces as a temporal "gravitational field" influencing the position of ideologies over time. Users can interact with the sphere, set their own coordinates, and explore the proximity to ideological clusters.

## Mathematical Model

### Ideology Representation

Each ideology $i$ is represented as a 3D point:

$$ v_i = (x_i, y_i, z_i) $$

- $x_i, y_i, z_i \in [-1, 1]$
- `base` coordinates correspond to the **canonical starting position** of the ideology.
- `startYear` defines the year from which the ideology is active.

The user position is similarly represented:

$$ v_u = (x_u, y_u, z_u) $$

The **radicality** of a user’s position is defined as the Euclidean norm:

$$ r_u = || v_u || = \sqrt{x^{2}_{u} + y^{2}_{u} + z^{2}_{u}} $$

### Historical Influence ("Gravitational Force")

Each historical event $e$ is represented as:

$$ h_e = (x_e, y_e, z_e),\ strength\ s_e,\ year\ t_e $$

For an ideology $i$ at year $t$, the influence of an event (**force**) is:

$$ f_e(t) = s_e\cdot g \cdot (1 - \frac{|t - t_e|}{T}),\ for\ |t - t_e| \leq T$$

Where:

- $T$ is the time window of influence (currently 60 years)
- $g$ is the historical gravity coefficient (adjustable by user)

The ideology is updated according to cumulative event forces:

$$ v_i(t) = v_i^{base} + \sum_{e} f_e(t) \cdot (h_e - v_i^{base}) $$

Finally, coordinates are normalized to remain inside the unit sphere:

$$ v_i(t) \leftarrow \frac{v_i(t)}{max(||v_i(t)||, 1)} $$

### Distance Metrics

To determine proximity between a user and an ideology:

$$ d(\mathbf{v}_i, \mathbf{v}_u) = \sqrt{(x_i - x_u) ^ 2 + (y_i - y_u) ^ 2 + (z_i - z_u) ^ 2} $$

The ideology with minimum $d(\mathbf{v}_i, \mathbf{v}_u)$ is considered closest to the user.

For k-means clustering of active ideologies:

$$ C_j = \frac{1}{|G_j|} \sum_{\mathbf{v}_i \in G_j} \mathbf{v}_i $$


Where $G_j$ is the set of points in cluster $j$, and $C_j$ is the centroid.

## Rendering & Projection

### Rotation in 3D

Interactive rotation around x and y axes uses:

$$ x' = x\ \cos\ \theta_y - z\ \sin\ \theta_y$$
$$ z' = x\ \sin\ \theta_y + z\ \cos\ \theta_y$$
$$ y' = y\ \cos\ \theta_x - z'\ \sin\ \theta_x$$
$$ z'' = y\ \sin\ \theta_x + z' $$

Where $\theta_x, \theta_y$ are mouse-controlled rotation angles.

### Perspective Projection

Projected onto 2D canvas:

$$ scale = \frac{r}{2 - z''},\ x_{2D} = cx + x' \cdot scale,\ y_{2D} = cy - y' \cdot scale $$

- $r$ is the base sphere radius
- $(cx, cy)$ is the canvas center

This gives a pseudo-3D effect without `WebGL`.

### RGB Mapping

Ideology positions are mapped to RGB:

$$ R = \frac{x + 1}{2}\cdot 255,\ G = \frac{y + 1}{2}\cdot 255, B = \frac{z + 1}{2}\cdot 255 $$

Trails and gradients use alpha blending for opacity and depth perception.

## Data Structures

- Ideology object:

```javascript
{
  name: String,
  base: {x, y, z},
  startYear: Number,
  x, y, z: current position,
  trail: Array of past positions
}
```

- Historical event object:

```javascript
{
  year: Number,
  x, y, z: coordinates,
  strength: Number
}
```

- User object:

```javascript
{
  name: "You",
  x, y, z
}
```

## User Interaction

**1. Mouse drag:** rotate the 3D sphere

**2. Sliders:** X, Y, Z coordinates; year; historical gravity

**3. Buttons:** auto-play, export PNG

All interactions dynamically update the visualization and proximity calculations.

## Planned Extensions

- Encode temporal evolution using color, opacity, or trail density
- Expanded ideology dataset
- Include minor political movements
- Multiple events per ideology
- Enhanced clustering analysis
- Probabilistic influence using Gaussian decay
- Metrics for cluster stability over time
- CodePen / GitHub Pages deployment
- Fully online, interactive version
- Multilingual interface
- Academic research integration
- Export data for quantitative analysis
- Study ideological proximity and historical shifts

## Research Implications

- Provides a visual and quantitative tool for exploring ideology evolution
- Allows longitudinal analysis of movements over centuries
- Serves as an educational sandbox for understanding the dynamics of political ideologies
- Historical influence modeled as gravitational fields offers an intuitive yet mathematically grounded approach