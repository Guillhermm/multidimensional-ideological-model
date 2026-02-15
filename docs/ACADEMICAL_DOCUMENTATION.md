# Multidimensional Ideological Model Academical Documentation

The Multidimensional Ideological Model is a computational framework to visualize and quantify political ideologies in a continuous 3D ideological space, extended with temporal dynamics that simulate historical influence.

The model treats ideologies as points in space:

$$ \mathbf{v}_i = (x_i, y_i, z_i),\ x_i, y_i, z_i \in [-1, 1] $$

where: 

- $x$ corresponds to economic dimension (left-right)
- $y$ corresponds to social / political engagement
- $z$ corresponds to identity

Each ideology also has a start year $t_{start}$ indicating when it becomes active in the simulation.

## Ideology Representation

Each ideology $i$ has:

$$ \mathbf{v}^{base}_i = (x^{base}_i, y^{base}_i, z^{base}_i) $$

and a trail of historical positions over time:

$$ trail_i = [\mathbf{v}_i (t_0), \mathbf{v}_i (t_1), ..., \mathbf{v}_i (t_n)] $$

User vector is defined similarly:

$$ \mathbf{v}_u = (x_u, y_u, z_u) $$

with radicality:

$$ r_u = || \mathbf{v}_u || = \sqrt{x^{2}_{u} + y^{2}_{u} + z^{2}_{u}} $$

## Base Ideology Dataset

| Ideology              | X     | Y     | Z     | Start Year |
| :---                  | :---: | :---: | :---: |    :---:   |
| Classical Liberalism	|	 0.6	| -0.5	| -0.6	|    1776    | 
| Neoliberalism	       	|  0.75 |	-0.35	|	-0.6	|	   1970    |
| Libertarianism	     	|  0.9 	|	-0.9	|	-0.8	|	   1940    |
| Anarcho-Capitalism    |	 1   	|	-1	 	| -0.7	|	   1950	   |
| Anarchism           	|	-0.95	|	-0.9 	|	-0.4	|	   1860 	 |
| Social Democracy    	|	-0.3 	|	-0.15	|	-0.5	|	   1860  	 |
| Eco-Socialism	      	| -0.75	|	-0.35	|	-0.75	|	   1970  	 |
| Stalinism	          	| -0.85	|  0.8 	|	-0.1	|	   1924    |
| Maoism	            	| -0.9 	|	 0.7 	|	-0.2	|	   1943  	 |
| Trotskyism	        	| -0.85	|	 0.6	|	-0.5	|	   1920  	 |
| Fascism             	|	 0.7 	|  0.85	|	 0.9	|	   1919  	 |
| Nazism	             	|  0.8  |	 0.9 	|	 0.95	|	   1920  	 |
| Conservatism         	|	 0.5	|  0.2 	|	 0.7	|	   1800    |
| Neoconservatism     	|  0.6  |	 0.4 	|	 0.7	|	   1940  	 |
| Nationalism	        	|  0.35 |	 0.4 	|	 0.9	|	   1800  	 |
| Technocracy          	|	 0.25 |	 0.55	|	-0.1	|	   1920  	 |
| Populism	          	|  0.15 |	 0.65	|	 0.55	|	   1930  	 |
| Monarchism          	|	 0.55 |	 0.7 	|	 0.75	|	   1700    |
| Theocracy           	|  0.4 	|  0.9	|  0.85	|	   1600    |
| Municipalism        	|	-0.65	|	-0.75	|	-0.45	|	   1980  	 |

Table can be extended as more ideologies are added in future research.

## Historical Events as Gravitational Forces

Historical events are represented as points in the ideological space with strength $s_e$ and year $t_e$:

$$ h_e = (x_e, y_e, z_e),\ s_e > 0 $$

For ideology $i$ at year $t$, the event's influence is defined as:

$$ 
f_e(t) =
  \begin{cases}
    s_e \cdot g \cdot (1 - \frac{|t - t_e|}{T}), & \quad |t - t_e| \leq T\\
    0, & \quad |t - t_e| > T
  \end{cases}
$$

where:

- $T$ = temporal window (defaults to 60 year)
- $g$ = user-controlled historical gravity coefficient

Updated ideology vector:

$$ \mathbf{v}_i(t) = \mathbf{v}_i^{base} + \sum_{e} f_e(t) \cdot (h_e - \mathbf{v}_i^{base}) $$

Finally, normalize if outside unit sphere:

$$ \mathbf{v}_i(t) \leftarrow \frac{\mathbf{v}_i(t)}{max(||\mathbf{v}_i(t)||, 1)} $$

### Example: Fascism Evolution (Numerical)

- Base: $(0.7, 0.85, 0.9)$ start year $1919$
- Historical event: Nazism, 1933, $(0.8, 0.9, 0.95)$, strength $1.2$
- Current year: $1935$
- Gravity $g = 1$

Event influence:

$$ f_{Nazism}(1935) = 1.2 \cdot 1 \cdot (1 - \frac{2}{60} = 1.16 $$

Update:

$$ \mathbf{v}_{Facism}(1935) = (0.7, 0.85, 0.9) + 1.16 \cdot (0.1, 0.05, 0.05) \approx (0.816, 0.908, 0.958) $$

Normalized to unit sphere if necessary.