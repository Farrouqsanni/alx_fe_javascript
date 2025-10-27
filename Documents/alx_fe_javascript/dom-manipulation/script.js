// ======= Data & Storage Keys =======
const LOCAL_KEY = "dcg_quotes_v1";       // localStorage key for quotes
const SESSION_LAST_INDEX = "dcg_last_index"; // sessionStorage key for last viewed index

// default quotes (used only if localStorage empty)
const DEFAULT_QUOTES = [
  { text: "Knowledge is power.", category: "Wisdom" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Believe you can and you’re halfway there.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

// runtime quotes array (will be loaded from localStorage if present)
let quotes = [];

// ======= DOM refs =======
const quoteTextEl = () => document.getElementById("quote-text");
const quoteCategoryEl = () => document.getElementById("quote-category");
const newQuoteBtn = () => document.getElementById("new-quote-btn");
const addQuoteBtn = () => document.getElementById("add-quote-btn");
const exportBtn = () => document.getElementById("export-btn");
const importFileInput = () => document.getElementById("importFile");
const importBtn = () => document.getElementById("import-btn");

// ======= Storage helpers =======
function saveQuotesToLocal() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

function loadQuotesFromLocal() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) {
    quotes = DEFAULT_QUOTES.slice();
    saveQuotesToLocal();
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Validate items are objects with text and category (fall back if invalid)
      const valid = parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (valid) quotes = parsed;
      else {
        console.warn("Local data invalid — loading defaults.");
        quotes = DEFAULT_QUOTES.slice();
        saveQuotesToLocal();
      }
    } else {
      quotes = DEFAULT_QUOTES.slice();
      saveQuotesToLocal();
    }
  } catch (err) {
    console.warn("Failed parsing localStorage — resetting to defaults.", err);
    quotes = DEFAULT_QUOTES.slice();
    saveQuotesToLocal();
  }
}

// ======= Session helpers =======
function saveLastViewedIndex(idx) {
  try {
    sessionStorage.setItem(SESSION_LAST_INDEX, String(idx));
  } catch (e) { /* ignore session errors */ }
}

function loadLastViewedIndex() {
  const raw = sessionStorage.getItem(SESSION_LAST_INDEX);
  if (raw === null) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

// ======= Core functions =======
function displayRandomQuote() {
  if (!quotes || quotes.length === 0) {
    if (quoteTextEl()) quoteTextEl().textContent = "No quotes available.";
    if (quoteCategoryEl()) quoteCategoryEl().textContent = "";
    return;
  }
  const index = Math.floor(Math.random() * quotes.length);
  const q = quotes[index];
  if (quoteTextEl()) quoteTextEl().textContent = q.text;
  if (quoteCategoryEl()) quoteCategoryEl().textContent = `Category: ${q.category}`;
  saveLastViewedIndex(index);
}

function addQuote() {
  const textInput = document.getElementById("new-quote-text");
  const catInput = document.getElementById("new-quote-category");
  if (!textInput || !catInput) return;

  const newText = textInput.value.trim();
  const newCat = catInput.value.trim();
  if (!newText || !newCat) {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  const newObj = { text: newText, category: newCat };
  quotes.push(newObj);
  saveQuotesToLocal();

  // clear fields & show newly-added quote immediately
  textInput.value = "";
  catInput.value = "";
  // Show the new quote (last element)
  const lastIndex = quotes.length - 1;
  if (quoteTextEl()) quoteTextEl().textContent = quotes[lastIndex].text;
  if (quoteCategoryEl()) quoteCategoryEl().textContent = `Category: ${quotes[lastIndex].category}`;
  saveLastViewedIndex(lastIndex);
}

// ======= Import / Export =======
function exportQuotesToJson() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const now = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    const filename = `quotes_${now}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed. Check console for details.");
  }
}

function importFromJsonFile(file) {
  if (!file) {
    alert("Please select a JSON file to import.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (!Array.isArray(parsed)) {
        alert("Imported JSON must be an array of quote objects.");
        return;
      }
      // Validate objects
      const cleaned = parsed.filter(item => item && typeof item.text === "string" && typeof item.category === "string");
      if (cleaned.length === 0) {
        alert("No valid quote objects found in the file (expected objects with text and category).");
        return;
      }
      // Merge and save
      quotes.push(...cleaned);
      saveQuotesToLocal();
      alert(`Imported ${cleaned.length} quote(s) successfully!`);
      displayRandomQuote();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to parse JSON file. Make sure it is valid JSON.");
    }
  };
  reader.readAsText(file);
}

// helper called by UI import button (separate from onchange)
function handleImportButton() {
  const fileInput = importFileInput();
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Select a .json file first (use the file input).");
    return;
  }
  importFromJsonFile(fileInput.files[0]);
}

// ======= Initialization & Event binding (safe DOM load) =======
document.addEventListener("DOMContentLoaded", function () {
  // Load persisted quotes
  loadQuotesFromLocal();

  // Show last viewed if available
  const lastIndex = loadLastViewedIndex();
  if (lastIndex !== null && quotes[lastIndex]) {
    if (quoteTextEl()) quoteTextEl().textContent = quotes[lastIndex].text;
    if (quoteCategoryEl()) quoteCategoryEl().textContent = `Category: ${quotes[lastIndex].category}`;
  } else {
    displayRandomQuote();
  }

  // Bind UI events
  const newBtn = newQuoteBtn();
  const addBtn = addQuoteBtn();
  const exBtn = exportBtn();
  const imBtn = importBtn();
  const fileInput = importFileInput();

  if (newBtn) newBtn.addEventListener("click", displayRandomQuote);
  if (addBtn) addBtn.addEventListener("click", addQuote);
  if (exBtn) exBtn.addEventListener("click", exportQuotesToJson);
  if (imBtn) imBtn.addEventListener("click", handleImportButton);

  // Optional: trigger import when user selects file (uncomment if you want immediate import on selection)
  // if (fileInput) fileInput.addEventListener("change", () => { if (fileInput.files[0]) importFromJsonFile(fileInput.files[0]); });
});
