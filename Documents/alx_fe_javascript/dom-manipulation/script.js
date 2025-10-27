// Ensure DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  populateCategories();
  restoreFilter();
  displayRandomQuote();

  document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
  document.getElementById("add-quote-btn").addEventListener("click", addQuote);
});

// Default quotes
let quotes = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// ====== Web Storage Handling ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// ====== Display Random Quote ======
function displayRandomQuote() {
  const category = localStorage.getItem("selectedCategory") || "all";
  let filteredQuotes =
    category === "all"
      ? quotes
      : quotes.filter((q) => q.category === category);

  if (filteredQuotes.length === 0) {
    document.getElementById("quote-text").textContent = "No quotes found for this category.";
    document.getElementById("quote-category").textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  document.getElementById("quote-text").textContent = quote.text;
  document.getElementById("quote-category").textContent = `Category: ${quote.category}`;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ====== Add New Quote ======
function addQuote() {
  const newQuoteText = document.getElementById("new-quote-text").value.trim();
  const newQuoteCategory = document.getElementById("new-quote-category").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
    alert("Quote added successfully!");
    displayRandomQuote();
  } else {
    alert("Please fill in both fields before adding a quote.");
  }
}

// ====== Populate Categories ======
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const uniqueCategories = [...new Set(quotes.map((q) => q.category))];
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// ====== Filter Quotes ======
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// ====== Restore Filter on Reload ======
function restoreFilter() {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    document.getElementById("categoryFilter").value = savedCategory;
  }
}

// ====== JSON Export ======
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

// ====== JSON Import ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
    displayRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}
