const quotes = [
  "The journey of a thousand miles begins with a single step.",
  "What you think, you become.",
  "Excellence is not an act, but a habit.",
  "Do what you can, with what you have, where you are."
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

newQuoteBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[randomIndex];
});
