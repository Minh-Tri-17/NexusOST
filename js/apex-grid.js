/* 
  Nexus ERP + HRM - ApexGrid Component & Theme Handler Logic
*/

/* 1. Custom Scrollbar System for ApexGrid Shadow Root Tree */
function applyNexusUnifiedScrollbar(rootNode, isDark) {
  if (!rootNode) return;
  const thumbColor = isDark ? "#334155" : "#cbd5e1";
  const thumbHover = isDark ? "#475569" : "#94a3b8";

  let tag = rootNode.getElementById
    ? rootNode.getElementById("nexus-unified-scrollbar-style")
    : null;
  if (!tag && rootNode.appendChild) {
    tag = document.createElement("style");
    tag.id = "nexus-unified-scrollbar-style";
    rootNode.appendChild(tag);
  }
  if (tag) {
    tag.textContent = `
      * {
        scrollbar-width: thin !important;
        scrollbar-color: ${thumbColor} transparent !important;
      }
      ::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
      }
      ::-webkit-scrollbar-button,
      ::-webkit-scrollbar-button:single-button,
      ::-webkit-scrollbar-button:vertical:start:decrement,
      ::-webkit-scrollbar-button:vertical:end:increment,
      ::-webkit-scrollbar-button:horizontal:start:decrement,
      ::-webkit-scrollbar-button:horizontal:end:increment {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      ::-webkit-scrollbar-track {
        background: transparent !important;
      }
      ::-webkit-scrollbar-thumb {
        background: ${thumbColor} !important;
        border-radius: 9999px !important;
        border: 1px solid transparent !important;
        background-clip: padding-box !important;
        transition: background-color 0.2s ease !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${thumbHover} !important;
        border: 1px solid transparent !important;
        background-clip: padding-box !important;
      }
      ::-webkit-scrollbar-corner {
        background: transparent !important;
      }
      igc-scrollbar, .ig-scrollbar, .ig-grid-scroll, [part="scrollbar"], [part="scroll"] {
        background: transparent !important;
        --ig-scrollbar-background: transparent !important;
      }
      igc-scrollbar [part*="button"], igc-scrollbar button, igc-scrollbar igc-icon, .ig-scrollbar__button {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
  }
  try {
    const root = rootNode.shadowRoot || rootNode;
    const allEls = root.querySelectorAll ? root.querySelectorAll("*") : [];
    allEls.forEach((el) => {
      if (el.shadowRoot) applyNexusUnifiedScrollbar(el.shadowRoot, isDark);
    });
  } catch (e) {}
}

/* 2. Hide Built-in ApexGrid Shadow Root Paginator */
function applyNexusCustomPagination(rootNode, isDark) {
  if (!rootNode) return;

  let tag = rootNode.getElementById
    ? rootNode.getElementById("nexus-paginator-custom-style")
    : null;
  if (!tag && rootNode.appendChild) {
    tag = document.createElement("style");
    tag.id = "nexus-paginator-custom-style";
    rootNode.appendChild(tag);
  }
  if (tag) {
    tag.textContent = `
      /* Hide Built-in ApexGrid Paginator Dock */
      igc-paginator, [part="paginator"], .ig-paginator, footer, .ag-footer {
        display: none !important;
      }
    `;
  }
  try {
    const root = rootNode.shadowRoot || rootNode;
    const allEls = root.querySelectorAll ? root.querySelectorAll("*") : [];
    allEls.forEach((el) => {
      if (el.shadowRoot) applyNexusCustomPagination(el.shadowRoot, isDark);
    });
  } catch (e) {}
}

/* 3. ApexGrid Theme Handler (Pure Native Theme Presets) */
/* ─── Badge CSS Vars set on :root — pierce shadow DOM automatically ────── */
function applyNexusBadgeCSSVars(isDark) {
  const r = document.documentElement;
  if (isDark) {
    r.style.setProperty("--npill-high-bg", "rgba(225,29,72,0.3)");
    r.style.setProperty("--npill-high-txt", "#fb7185");
    r.style.setProperty("--npill-high-bd", "rgba(244,63,94,0.5)");
    r.style.setProperty("--npill-std-bg", "rgba(2,132,199,0.25)");
    r.style.setProperty("--npill-std-txt", "#38bdf8");
    r.style.setProperty("--npill-std-bd", "rgba(56,189,248,0.4)");
    r.style.setProperty("--npill-low-bg", "rgba(71,85,105,0.3)");
    r.style.setProperty("--npill-low-txt", "#cbd5e1");
    r.style.setProperty("--npill-low-bd", "rgba(148,163,184,0.3)");
  } else {
    r.style.setProperty("--npill-high-bg", "#ffe4e6");
    r.style.setProperty("--npill-high-txt", "#be123c");
    r.style.setProperty("--npill-high-bd", "#fecdd3");
    r.style.setProperty("--npill-std-bg", "#e0f2fe");
    r.style.setProperty("--npill-std-txt", "#0284c7");
    r.style.setProperty("--npill-std-bd", "#bae6fd");
    r.style.setProperty("--npill-low-bg", "#f1f5f9");
    r.style.setProperty("--npill-low-txt", "#475569");
    r.style.setProperty("--npill-low-bd", "#e2e8f0");
  }
}

function initApexGridDarkModeHandler() {
  const updateGridStyles = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const grids = document.querySelectorAll("apex-grid");

    grids.forEach((grid) => {
      // Remove any leftover injected shadow DOM style tags
      const cleanShadowRoot = (root) => {
        if (!root) return;

        try {
          root.querySelectorAll("*").forEach((child) => {
            if (child.shadowRoot) cleanShadowRoot(child.shadowRoot);
          });
        } catch (e) {}
      };
      if (grid.shadowRoot) cleanShadowRoot(grid.shadowRoot);

      // Set Theme Attributes & Brand Colors
      if (isDark) {
        grid.setAttribute("theme", "dark tinted");
        grid.style.setProperty("--ag-brand", "#a78bfa");
        grid.style.setProperty("--ag-brand-strong", "#c4b5fd");
      } else {
        grid.setAttribute("theme", "tinted");
        grid.style.setProperty("--ag-brand", "#7c3aed");
        grid.style.setProperty("--ag-brand-strong", "#6d28d9");
      }

      // Apply Custom Styles to Grid Shadow Root
      if (grid.shadowRoot) {
        applyNexusUnifiedScrollbar(grid.shadowRoot, isDark);
        applyNexusCustomPagination(grid.shadowRoot, isDark);
      }

      // Update badge CSS vars on :root (pierce shadow DOM automatically)
      applyNexusBadgeCSSVars(isDark);
    });
  };

  updateGridStyles();
  setTimeout(updateGridStyles, 200);
  setTimeout(updateGridStyles, 600);
  setTimeout(updateGridStyles, 1200);

  window.updateNexusGridDarkMode = updateGridStyles;
}

/* 2. Country Management Page - ApexGrid Initialization & Dynamic Stat Cards */
async function initCountryGrid() {
  const grid = document.getElementById("grid");
  if (!grid) return;

  // Import Lit html template tag dynamically for cellTemplate rendering
  let html;
  try {
    const litModule = await import("https://cdn.jsdelivr.net/npm/lit@3/+esm");
    html = litModule.html;
  } catch (e) {
    console.warn("Lit html module loading skipped:", e);
  }

  // Seed Country Data
  const seedCountries = [
    {
      code: "VN",
      countryName: "Việt Nam",
      capital: "Hà Nội",
      region: "Asia",
      basePop: 98186856,
      priority: "High",
    },
    {
      code: "US",
      countryName: "United States",
      capital: "Washington, D.C.",
      region: "Americas",
      basePop: 331893745,
      priority: "High",
    },
    {
      code: "JP",
      countryName: "Japan",
      capital: "Tokyo",
      region: "Asia",
      basePop: 125507472,
      priority: "High",
    },
    {
      code: "DE",
      countryName: "Germany",
      capital: "Berlin",
      region: "Europe",
      basePop: 83190556,
      priority: "Standard",
    },
    {
      code: "GB",
      countryName: "United Kingdom",
      capital: "London",
      region: "Europe",
      basePop: 67326569,
      priority: "High",
    },
    {
      code: "FR",
      countryName: "France",
      capital: "Paris",
      region: "Europe",
      basePop: 67749632,
      priority: "Standard",
    },
    {
      code: "KR",
      countryName: "South Korea",
      capital: "Seoul",
      region: "Asia",
      basePop: 51744876,
      priority: "High",
    },
    {
      code: "SG",
      countryName: "Singapore",
      capital: "Singapore",
      region: "Asia",
      basePop: 5453600,
      priority: "High",
    },
    {
      code: "AU",
      countryName: "Australia",
      capital: "Canberra",
      region: "Oceania",
      basePop: 25688079,
      priority: "Standard",
    },
    {
      code: "CA",
      countryName: "Canada",
      capital: "Ottawa",
      region: "Americas",
      basePop: 38246108,
      priority: "Standard",
    },
    {
      code: "TH",
      countryName: "Thailand",
      capital: "Bangkok",
      region: "Asia",
      basePop: 71601103,
      priority: "Standard",
    },
    {
      code: "CN",
      countryName: "China",
      capital: "Beijing",
      region: "Asia",
      basePop: 1412360000,
      priority: "High",
    },
    {
      code: "IN",
      countryName: "India",
      capital: "New Delhi",
      region: "Asia",
      basePop: 1408044253,
      priority: "High",
    },
    {
      code: "BR",
      countryName: "Brazil",
      capital: "Brasília",
      region: "Americas",
      basePop: 214326223,
      priority: "Low",
    },
    {
      code: "IT",
      countryName: "Italy",
      capital: "Rome",
      region: "Europe",
      basePop: 59066225,
      priority: "Standard",
    },
    {
      code: "ES",
      countryName: "Spain",
      capital: "Madrid",
      region: "Europe",
      basePop: 47415750,
      priority: "Standard",
    },
    {
      code: "NL",
      countryName: "Netherlands",
      capital: "Amsterdam",
      region: "Europe",
      basePop: 17530000,
      priority: "Standard",
    },
    {
      code: "SE",
      countryName: "Sweden",
      capital: "Stockholm",
      region: "Europe",
      basePop: 10420000,
      priority: "Low",
    },
    {
      code: "CH",
      countryName: "Switzerland",
      capital: "Bern",
      region: "Europe",
      basePop: 8700000,
      priority: "High",
    },
    {
      code: "AE",
      countryName: "United Arab Emirates",
      capital: "Abu Dhabi",
      region: "Asia",
      basePop: 9890400,
      priority: "High",
    },
  ];

  const usersSeed = ["Admin User", "Tristan Nguyen", "System Bot", "Sarah Jenkins", "Alex Rivera"];
  const notesSeed = [
    "Strategic key market",
    "Standard operational hub",
    "Compliance review pending",
    "High growth potential",
    "Regional office center",
    "Trade agreement active",
  ];

  const countryData = [];
  for (let i = 1; i <= 120; i++) {
    const item = seedCountries[(i - 1) % seedCountries.length];
    const suffix = Math.ceil(i / seedCountries.length);
    const creator = usersSeed[(i - 1) % usersSeed.length];
    const updater = usersSeed[(i + 1) % usersSeed.length];
    const createdDate = `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`;
    const updatedDate = `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`;
    const rowNote = notesSeed[(i - 1) % notesSeed.length];

    countryData.push({
      select: false,
      id: String(i).padStart(4, "0"),
      code: `${item.code}${suffix > 1 ? suffix : ""}`,
      countryName: `${item.countryName}${suffix > 1 ? " (" + suffix + ")" : ""}`,
      capital: item.capital,
      region: item.region,
      population: Math.round(item.basePop * (1 + (i % 5) * 0.05)),
      priority: item.priority,
      active: i % 7 !== 0,
      createdBy: creator,
      createdAt: createdDate,
      updatedBy: updater,
      updatedAt: updatedDate,
      note: rowNote,
    });
  }

  const STATUS_LABEL = {
    High: "High Priority",
    Standard: "Standard",
    Low: "Low",
  };
  // Badge colors via CSS vars on :root (pierce shadow DOM).
  // Vars are updated by applyNexusBadgeCSSVars() on every theme toggle.
  const PILL_KEY = { High: "high", Standard: "std", Low: "low" };
  const pillStyle = (v) => {
    const k = PILL_KEY[v] || "low";
    return (
      `display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;` +
      `background:var(--npill-${k}-bg);color:var(--npill-${k}-txt);border:1px solid var(--npill-${k}-bd);`
    );
  };

  const countryColumns = [
    {
      key: "code",
      headerText: "Country Code",
      width: "140px",
      sort: true,
      filter: true,
      resizable: true,
      pinned: true,
    },
    {
      key: "countryName",
      headerText: "Country Name",
      width: "200px",
      sort: true,
      filter: true,
      resizable: true,
      pinned: true,
    },
    {
      key: "capital",
      headerText: "Capital",
      width: "180px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "region",
      headerText: "Region",
      width: "160px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "population",
      headerText: "Population",
      width: "180px",
      type: "number",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "priority",
      headerText: "Priority",
      width: "150px",
      sort: true,
      filter: true,
      resizable: true,
      cellTemplate: ({ value }) =>
        html
          ? html`<span style="${pillStyle(value)}">${STATUS_LABEL[value] ?? value}</span>`
          : String(value),
    },
    {
      key: "active",
      headerText: "Active",
      width: "120px",
      type: "boolean",
      resizable: true,
    },
    {
      key: "createdBy",
      headerText: "CreateBy",
      width: "180px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "createdAt",
      headerText: "CreateAt",
      width: "160px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "updatedBy",
      headerText: "UpdateBy",
      width: "180px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "updatedAt",
      headerText: "UpdateAt",
      width: "160px",
      sort: true,
      filter: true,
      resizable: true,
    },
    {
      key: "note",
      headerText: "Note",
      width: "260px",
      sort: true,
      filter: true,
      resizable: true,
    },
  ];

  window.allCountryData = countryData;
  grid.style.height = "550px";
  grid.columns = countryColumns;
  grid.selection = {
    enabled: true,
    mode: "multiple",
    showCheckboxColumn: true,
  };
  grid.pagination = false;

  // Pin Code and Country Name columns
  try {
    await customElements.whenDefined("apex-grid");
    requestAnimationFrame(async () => {
      if (typeof grid.pinColumn === "function") {
        await grid.pinColumn("code", "start");
        await grid.pinColumn("countryName", "start");
      }
    });
  } catch (e) {
    /* cosmetic fallback */
  }

  // Compute & update quick stat cards dynamically
  const totalCount = countryData.length;
  const activeCount = countryData.filter((c) => c.active).length;
  const totalPop = countryData.reduce((acc, c) => acc + c.population, 0);
  const highPriorityCount = countryData.filter((c) => c.priority === "High").length;
  const uniqueRegionsCount = new Set(countryData.map((c) => c.region)).size;

  const elTotal = document.getElementById("statTotalCountries");
  const elActive = document.getElementById("statActiveMarkets");
  const elPop = document.getElementById("statTotalPopulation");
  const elPriority = document.getElementById("statHighPriority");
  const elRegions = document.getElementById("statTotalRegions");

  if (elTotal) elTotal.textContent = totalCount;
  if (elActive) elActive.textContent = activeCount;
  if (elPop) elPop.textContent = (totalPop / 1e9).toFixed(2) + "B";
  if (elPriority) elPriority.textContent = highPriorityCount;
  if (elRegions) elRegions.textContent = uniqueRegionsCount;

  if (typeof window.updateNexusGridDarkMode === "function") {
    setTimeout(window.updateNexusGridDarkMode, 150);
  }
}

// Expose on window object
window.applyNexusUnifiedScrollbar = applyNexusUnifiedScrollbar;
window.applyNexusCustomPagination = applyNexusCustomPagination;
window.initApexGridDarkModeHandler = initApexGridDarkModeHandler;
window.initCountryGrid = initCountryGrid;
