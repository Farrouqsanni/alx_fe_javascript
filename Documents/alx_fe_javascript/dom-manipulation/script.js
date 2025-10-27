// quotes array with text and category
const quotes = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteText = document.getElementById("quote-text");
  const quoteCategory = document.getElementById("quote-category");

  if (quoteText && quoteCategory) {
    quoteText.textContent = quote.text;
    quoteCategory.textContent = `Category: ${quote.category}`;
  }
}

// function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("new-quote-text").value.trim();
  const newQuoteCategory = document.getElementById("new-quote-category").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
    displayRandomQuote();
  } else {
    alert("Please fill in both fields before adding a quote.");
  }
}

// ensure DOM is fully loaded before running
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
  document.getElementById("add-quote-btn").addEventListener("click", addQuote);
  displayRandomQuote();
});
