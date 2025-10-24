// script.js
const quotes = [
  "Success is no accident.",
  "Dream big and dare to fail.",
  "Discipline beats motivation.",
  "ALX: Building Africa’s tech leaders!"
];

const button = document.getElementById('generateBtn');
const output = document.getElementById('output');

button.addEventListener('click', () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  output.textContent = randomQuote;
});

