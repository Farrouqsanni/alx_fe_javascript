// === Dynamic Quote Generator with Filtering and Web Storage ===

// Default quotes
let quotes = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// === Storage Functions ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

function saveSelectedCategory(cat) {
  localStorage.setItem("selectedCategory", cat);
}

function loadSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

// === DOM Manipulation ===
function displayRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  const filtered = filter === "all" ? quotes : quotes.filter(q => q.category === filter);

  const textEl = document.getElementById("quote-text");
  const catEl = document.getElementById("quote-category");

  if (filtered.length === 0) {
    textEl.textContent = "No quotes available in this category.";
    catEl.textContent = "";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  textEl.textContent = quote.text;
  catEl.textContent = `Category: ${quote.category}`;
}

function addQuote() {
  const text = document.getElementById("new-quote-text").value.trim();
  const category = document.getElementById("new-quote-category").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
  } else {
    alert("Please enter both a quote and category.");
  }
}

// === Category Filter System ===
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = Array.from(new Set(quotes.map(q => q.category)));

  select.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  // Restore saved selection
  select.value = loadSelectedCategory();
}

// ⚠️ ALX expects this exact name: filterQuote (singular)
function filterQuote() {
  const selected = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selected);
  displayRandomQuote();
}

// === JSON Import/Export ===
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// === Initialize App ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();

  document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
  document.getElementById("add-quote-btn").addEventListener("click", addQuote);
  document.getElementById("export-btn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuote);

  displayRandomQuote();
});
