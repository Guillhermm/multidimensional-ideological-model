const minYear = 1789;
const maxYear = new Date().getFullYear();
let currentYear = maxYear;
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

document.getElementById('autoPlay').onclick = () => auto = !auto;
yearLabel.innerText = currentYear;

if (typeof module !== 'undefined') module.exports = { minYear, maxYear };
