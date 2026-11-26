const minYear = 1789;
const maxYear = new Date().getFullYear();
let currentYear = maxYear;
// Playback only ever starts from the Auto button, never on load.
let auto = false;

const timeSlider = document.getElementById('timeSlider');
const yearLabel = document.getElementById('yearLabel');

timeSlider.min = minYear;
timeSlider.max = maxYear;
timeSlider.value = currentYear;

timeSlider.oninput = () => {
  currentYear = parseInt(timeSlider.value);
  yearLabel.innerText = currentYear;
};

const autoPlayButton = document.getElementById('autoPlay');
autoPlayButton.onclick = () => {
  auto = !auto;
  if (autoPlayButton.setAttribute) autoPlayButton.setAttribute('aria-pressed', String(auto));
};
yearLabel.innerText = currentYear;

if (typeof module !== 'undefined') module.exports = { minYear, maxYear, isAutoPlaying: () => auto };
