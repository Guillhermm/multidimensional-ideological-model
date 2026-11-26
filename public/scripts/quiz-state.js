const withAnswer = (answers, qi, val) => answers.map((a, i) => (i === qi ? val : a));

const isChecked = (answers, qi, val) => answers[qi] === val;

const firstUnanswered = (answers, [start, end]) => {
  for (let i = start; i <= end; i++) {
    if (answers[i] === null) return i;
  }
  return -1;
};

if (typeof module !== 'undefined') module.exports = { withAnswer, isChecked, firstUnanswered };
