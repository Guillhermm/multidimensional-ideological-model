const events = [
  { year: 1789, x: -0.4, y: -0.6, z: -0.2, strength: 0.8 },
  { year: 1917, x: -0.9, y: 0.8, z: -0.3, strength: 1.0 },
  { year: 1933, x: 0.8, y: 1, z: 1, strength: 1.2 },
  { year: 1945, x: 0, y: -0.2, z: -0.3, strength: 0.6 },
  { year: 1989, x: 0.6, y: -0.5, z: -0.6, strength: 0.7 },
  { year: 2008, x: -0.2, y: 0.3, z: 0.1, strength: 0.5 }
];

const baseIdeologies = [
  ['Classical Liberalism', 0.6, -0.5, -0.6, 1776],
  ['Neoliberalism', 0.75, -0.35, -0.6, 1970],
  ['Libertarianism', 0.9, -0.9, -0.8, 1940],
  ['Anarcho-Capitalism', 1, -1, -0.7, 1950],
  ['Anarchism', -0.95, -0.9, -0.4, 1860],
  ['Social Democracy', -0.3, -0.15, -0.5, 1860],
  ['Eco-Socialism', -0.75, -0.35, -0.75, 1970],
  ['Stalinism', -0.85, 0.8, -0.1, 1924],
  ['Maoism', -0.9, 0.7, -0.2, 1943],
  ['Trotskyism', -0.85, 0.6, -0.5, 1920],
  ['Fascism', 0.7, 0.85, 0.9, 1919],
  ['Nazism', 0.8, 0.9, 0.95, 1920],
  ['Conservatism', 0.5, 0.2, 0.7, 1800],
  ['Neoconservatism', 0.6, 0.4, 0.7, 1940],
  ['Nationalism', 0.35, 0.4, 0.9, 1800],
  ['Technocracy', 0.25, 0.55, -0.1, 1920],
  ['Populism', 0.15, 0.65, 0.55, 1930],
  ['Monarchism', 0.55, 0.7, 0.75, 1700],
  ['Theocracy', 0.4, 0.9, 0.85, 1600],
  ['Municipalism', -0.65, -0.75, -0.45, 1980],
];

const ideologies = baseIdeologies.map(i => ({
  name: i[0],
  base: { x: i[1], y: i[2], z: i[3] },
  startYear: i[4],
  x: i[1],
  y: i[2],
  z: i[3],
  trail: []
}));
