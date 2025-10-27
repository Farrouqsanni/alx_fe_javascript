// === Dynamic Quote Generator with Filtering and Web Storage ===

// Default quotes array
let quotes = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// === Utility Functions ===

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save last selected category
function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

// Load last selected category
function loadSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

// === DOM Functions ===

// Display a random quote (filtered if applicable)
function displayRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const filteredQuotes = categoryFilter === "all"
    ? quotes
    : quotes.filter(q => q.category === categoryFilter);

  if (filteredQuotes.length === 0) {
    document.getElementById("quote-text").textContent = "No quotes found in this category.";
    document.getElementById("quote-category").textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  document.getElementById("quote-text").textContent = quote.text;
  document.getElementById("quote-category").textContent = `Category: ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("new-quote-text").value.trim();
  const newQuoteCategory = document.getElementById("new-quote-category").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories(); // update dropdown dynamically
    displayRandomQuote();
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
  } else {
    alert("Please fill in both fields before adding a quote.");
  }
}

// === Filtering System ===

// Extract unique categories and populate dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = loadSelectedCategory();
  categoryFilter.value = lastCategory;
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selectedCategory);
  displayRandomQuote();
}

// === JSON Import/Export ===

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Initialize App ===
document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  populateCategories();

  // Restore and apply last selected category
  const savedCategory = loadSelectedCategory();
  document.getElementById("categoryFilter").value = savedCategory;

  document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
  document.getElementById("add-quote-btn").addEventListener("click", addQuote);
  document.getElementById("export-btn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

  displayRandomQuote();
});
