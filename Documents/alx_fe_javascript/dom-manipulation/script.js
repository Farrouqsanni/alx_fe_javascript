// === Dynamic Quote Generator with Server Sync & Conflict Resolution ===

// Local storage helpers
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

// === Initialize local quotes ===
let quotes = [
  { id: 1, text: "Knowledge is power.", category: "Wisdom", updatedAt: Date.now() },
  { id: 2, text: "Simplicity is the soul of efficiency.", category: "Productivity", updatedAt: Date.now() },
  { id: 3, text: "Believe you can and you’re halfway there.", category: "Motivation", updatedAt: Date.now() },
  { id: 4, text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming", updatedAt: Date.now() }
];

// === UI Update Functions ===
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
    const newQuote = {
      id: Date.now(),
      text,
      category,
      updatedAt: Date.now()
    };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    showNotification("Quote added locally and will sync soon.");
  } else {
    alert("Please enter both a quote and category.");
  }

  document.getElementById("new-quote-text").value = "";
  document.getElementById("new-quote-category").value = "";
}

// === Category Management ===
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

  select.value = loadSelectedCategory();
}

function filterQuote() {
  const selected = document.getElementById("categoryFilter").value;
  saveSelectedCategory(selected);
  displayRandomQuote();
}

// === Simulated Server Sync ===
function fetchServerQuotes() {
  // Simulated server response (pretend this came from API)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Knowledge is power.", category: "Wisdom", updatedAt: Date.now() },
        { id: 2, text: "Simplicity is the soul of efficiency.", category: "Productivity", updatedAt: Date.now() },
        { id: 5, text: "Consistency beats intensity.", category: "Motivation", updatedAt: Date.now() } // new server quote
      ]);
    }, 1500);
  });
}

// === Conflict Resolution ===
function resolveConflicts(serverQuotes) {
  const merged = [];
  const localMap = new Map(quotes.map(q => [q.id, q]));

  serverQuotes.forEach(sq => {
    if (!localMap.has(sq.id)) {
      // new server quote
      merged.push(sq);
      showNotification("New quote fetched from server!");
    } else {
      const local = localMap.get(sq.id);
      if (sq.updatedAt > local.updatedAt) {
        // server wins
        merged.push(sq);
        showNotification("Server version replaced a local quote due to conflict.");
      } else {
        merged.push(local);
      }
      localMap.delete(sq.id);
    }
  });

  // Add remaining local-only quotes
  for (const remaining of localMap.values()) {
    merged.push(remaining);
  }

  quotes = merged;
  saveQuotes();
  populateCategories();
  displayRandomQuote();
}

// === Notification System ===
function showNotification(message) {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.style.display = "block";
  setTimeout(() => (note.style.display = "none"), 4000);
}

// === Auto Sync Loop ===
async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  resolveConflicts(serverQuotes);
}

// === Initialization ===
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  displayRandomQuote();

  document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
  document.getElementById("add-quote-btn").addEventListener("click", addQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuote);

  // Periodic sync every 10s
  setInterval(syncWithServer, 10000);
});
