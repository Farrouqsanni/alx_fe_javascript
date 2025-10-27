// script.js - Dynamic Quote Generator with localStorage, sessionStorage, JSON import/export

// default quotes (used only if nothing in localStorage)
const DEFAULT_QUOTES = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// keys for storage
const LOCAL_STORAGE_KEY = "dynamic_quotes_v1";
const SESSION_LAST_INDEX_KEY = "last_viewed_quote_index_v1";

// in-memory quotes array (will be loaded from localStorage if available)
let quotes = [];

// ---------- Storage helpers ----------
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      quotes = DEFAULT_QUOTES.slice(); // clone defaults
      saveQuotes(); // persist defaults
      return;
    }
    const parsed = JSON.parse(raw);
    // validate structure: array of objects with text & category
    if (Array.isArray(parsed) && parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string")) {
      quotes = parsed;
    } else {
      // corrupted storage: reset to defaults
      console.warn("Local storage quotes malformed. Resetting to defaults.");
      quotes = DEFAULT_QUOTES.slice();
      saveQuotes();
    }
  } catch (err) {
    console.error("Failed to load quotes from localStorage:", err);
    quotes = DEFAULT_QUOTES.slice();
    saveQuotes();
  }
}

// ---------- Random display and session tracking ----------
function getRandomIndex() {
  if (!quotes || quotes.length === 0) return -1;
  return Math.floor(Math.random() * quotes.length);
}

function displayRandomQuote() {
  if (!quotes || quotes.length === 0) {
    updateQuoteDisplay("No quotes available.", "");
    return;
  }

  const randomIndex = getRandomIndex();
  displayQuoteByIndex(randomIndex);
}

function displayQuoteByIndex(index) {
  if (!quotes || quotes.length === 0) {
    updateQuoteDisplay("No quotes available.", "");
    return;
  }
  if (index < 0 || index >= quotes.length) {
    console.warn("displayQuoteByIndex: index out of bounds", index);
    return;
  }
  const q = quotes[index];
  updateQuoteDisplay(q.text, q.category);

  // store last viewed index in session storage (temporary - clears when browser session ends)
  try {
    sessionStorage.setItem(SESSION_LAST_INDEX_KEY, index.toString());
  } catch (err) {
    console.error("Failed to set sessionStorage value:", err);
  }

  // Update 'last seen' display
  updateLastSeenText(index);
}

function updateQuoteDisplay(text, category) {
  const quoteTextEl = document.getElementById("quote-text");
  const quoteCategoryEl = document.getElementById("quote-category");
  if (quoteTextEl) quoteTextEl.textContent = text;
  if (quoteCategoryEl) quoteCategoryEl.textContent = category ? `Category: ${category}` : "";
}

function updateLastSeenText(index) {
  const lastSeenEl = document.getElementById("last-seen");
  if (!lastSeenEl) return;
  try {
    lastSeenEl.textContent = `Last viewed quote index (session): ${index}`;
  } catch (err) {
    console.error(err);
  }
}

// ---------- Adding quotes ----------
function addQuote() {
  const newQuoteTextEl = document.getElementById("new-quote-text");
  const newQuoteCategoryEl = document.getElementById("new-quote-category");
  if (!newQuoteTextEl || !newQuoteCategoryEl) return;

  const text = newQuoteTextEl.value.trim();
  const category = newQuoteCategoryEl.value.trim();

  if (!text || !category) {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  // Add to in-memory array
  quotes.push({ text, category });
  // persist
  saveQuotes();

  // clear inputs
  newQuoteTextEl.value = "";
  newQuoteCategoryEl.value = "";

  // give feedback and display the new quote immediately
  const newIndex = quotes.length - 1;
  displayQuoteByIndex(newIndex);
  alert("Quote added and saved to local storage.");
}

// ---------- Export to JSON ----------
function exportQuotesToJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes_export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // revoke URL after a short delay to free resources
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error("Failed to export quotes:", err);
    alert("Export failed. See console for details.");
  }
}

// ---------- Import from JSON (file input onchange handler) ----------
function importFromJsonFile(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected for import.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      // Validate incoming data: array of {text: string, category: string}
      if (!Array.isArray(parsed) || !parsed.every(item => item && typeof item.text === "string" && typeof item.category === "string")) {
        alert("Imported JSON must be an array of objects like { text: string, category: string }.");
        return;
      }

      // Merge: push items that are not duplicates (simple duplicate detection by exact text+category)
      let addedCount = 0;
      parsed.forEach(item => {
        const exists = quotes.some(q => q.text === item.text && q.category === item.category);
        if (!exists) {
          quotes.push({ text: item.text, category: item.category });
          addedCount++;
        }
      });

      saveQuotes();
      alert(`Import complete. ${addedCount} new quotes added.`);
      // display one of the newly imported quotes if any, else leave current
      if (addedCount > 0) displayRandomQuote();
    } catch (err) {
      console.error("Failed to import JSON file:", err);
      alert("Failed to import JSON. Ensure the file contains valid JSON.");
    }
  };

  reader.onerror = function (err) {
    console.error("FileReader error:", err);
    alert("Failed to read the file.");
  };

  reader.readAsText(file);
}

// ---------- Utility: clear local storage & reset to defaults ----------
function clearLocalStorageAndReset() {
  if (!confirm("This will clear all saved quotes from local storage and reset to defaults. Continue?")) return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    loadQuotes(); // will reload defaults and save them
    displayRandomQuote();
    alert("Local storage cleared and defaults restored.");
  } catch (err) {
    console.error("Failed to clear local storage:", err);
    alert("Failed to clear local storage. See console for details.");
  }
}

// ---------- Initialization ----------
document.addEventListener("DOMContentLoaded", function () {
  // load quotes from localStorage
