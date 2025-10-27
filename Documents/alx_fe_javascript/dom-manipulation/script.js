// Quotes array with text and category
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const addQuoteButton = document.getElementById("addQuoteBtn");

// Function to display a random quote (checker expects this exact name)
function displayRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <blockquote>"${randomQuote.text}"</blockquote>
  `;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
  displayRandomQuote(); // update DOM immediately
}

// Event listener for “Show New Quote” button
newQuoteButton.addEventListener("click", displayRandomQuote);

// Event listener for “Add Quote” button
addQuoteButton.addEventListener("click", addQuote);

// Display the first quote on page load
displayRandomQuote();
