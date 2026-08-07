/* 
  Nexus ERP + HRM - Core JavaScript Logic
*/

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSidebarActiveState();
  initMobileSidebarToggle();
  initTopbarScrollEffect();
  initTopbarInteractiveControls();
  initFilterChipsSystem();

  if ((document.getElementById("countryTableBody") || document.getElementById("countryFormModal")) && typeof initCountryGrid === "function") {
    initCountryGrid();
  }

  // Render Dashboard Charts
  if (
    document.getElementById("chartMonthlyOverview") &&
    typeof renderMonthlyWorkforceOverviewChart === "function"
  ) {
    renderMonthlyWorkforceOverviewChart();
  }
  if (
    document.getElementById("chartDepartmentCategories") &&
    typeof renderDepartmentCategoriesDonutChart === "function"
  ) {
    renderDepartmentCategoriesDonutChart();
  }
  if (
    document.getElementById("chartEmployeeOrgTree") &&
    typeof initEmployeeOrgChart === "function"
  ) {
    initEmployeeOrgChart();
  }

  // Country Page Modal Handler
  if (document.getElementById("countryFormModal")) {
    initCountryPageModal();
  }

  // Employee Directory Page Logic
  if (document.getElementById("empCardView") || document.getElementById("empDetailModal")) {
    initEmployeesPage();
  }
});

/* 1. Sidebar Active Link matching current path */
function initSidebarActiveState() {
  const currentPath = window.location.pathname.split("/").pop() || "dashboard.html";

  // Handle standard nav links (exclude collapse-toggle)
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link:not(.collapse-toggle)");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPath ||
      (currentPath === "" && href === "dashboard.html") ||
      (currentPath === "index.html" && href === "dashboard.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Handle submenu links (Country, Province, Ward)
  const submenuLinks = document.querySelectorAll(".submenu-link");
  let isSubmenuActive = false;

  submenuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
      isSubmenuActive = true;
    } else {
      link.classList.remove("active");
    }
  });

  // If a submenu link is active, expand parent Categories collapse and set it active
  if (isSubmenuActive) {
    const categoriesToggle = document.querySelector(".collapse-toggle");
    const categoriesCollapse = document.getElementById("collapseCategories");
    if (categoriesToggle && categoriesCollapse) {
      categoriesToggle.classList.add("active");
      categoriesToggle.classList.remove("collapsed");
      categoriesToggle.setAttribute("aria-expanded", "true");
      categoriesCollapse.classList.add("show");
    }
  }
}

/* 2. Desktop & Mobile Sidebar Toggle */
function initMobileSidebarToggle() {
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.querySelector(".app-sidebar");
  const appWrapper = document.querySelector(".app-wrapper");

  // Create or select mobile backdrop overlay
  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }


  // Helper function to close mobile sidebar drawer
  const closeMobileSidebar = () => {
    if (sidebar) sidebar.classList.remove("show-sidebar");
    if (backdrop) backdrop.classList.remove("show");
  };

  // Helper function to open mobile sidebar drawer
  const openMobileSidebar = () => {
    if (sidebar) sidebar.classList.add("show-sidebar");
    if (backdrop) backdrop.classList.add("show");
  };

  // Apply saved collapsed preference on desktop
  const isCollapsed = localStorage.getItem("nexus_sidebar_collapsed") === "true";
  if (isCollapsed && appWrapper && window.innerWidth >= 992) {
    appWrapper.classList.add("sidebar-collapsed");
  }

  // Toggle button click handler
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.innerWidth < 992) {
        if (sidebar.classList.contains("show-sidebar")) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      } else {
        if (appWrapper) {
          appWrapper.classList.toggle("sidebar-collapsed");
          const nowCollapsed = appWrapper.classList.contains("sidebar-collapsed");
          localStorage.setItem("nexus_sidebar_collapsed", nowCollapsed);
        }
      }
    });
  }

  // Event listener to close sidebar when clicking backdrop
  if (backdrop) {
    backdrop.addEventListener("click", closeMobileSidebar);
  }

  // Auto-close mobile sidebar when clicking any navigation link
  const navLinks = document.querySelectorAll(".sidebar-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        closeMobileSidebar();
      }
    });
  });

  // Auto-close mobile sidebar on window resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeMobileSidebar();
    }
  });
}

/* 3. Dark/Light Theme Toggle Functionality */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("nexus_theme") || "light";

  // Apply saved theme on initial load
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("nexus_theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector("#themeToggleBtn i");
  if (icon) {
    if (theme === "dark") {
      icon.className = "fa-solid fa-sun";
      icon.parentElement.setAttribute("title", "Switch to Light Mode");
    } else {
      icon.className = "fa-regular fa-moon";
      icon.parentElement.setAttribute("title", "Switch to Dark Mode");
    }
  }
}

/* 4. Topbar Scroll Effect */
function initTopbarScrollEffect() {
  const topbar = document.querySelector(".app-topbar");
  if (!topbar) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      topbar.classList.add("topbar-scrolled");
    } else {
      topbar.classList.remove("topbar-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* 5. Interactive Topbar Controls (Search, Language, Notifications) */
function initTopbarInteractiveControls() {
  const langBtn = document.getElementById("langTranslateBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const currentLang = document.documentElement.getAttribute("lang") || "vi";
      const newLang = currentLang === "vi" ? "en" : "vi";
      document.documentElement.setAttribute("lang", newLang);
    });
  }

  const notifBtn = document.getElementById("notifBellBtn");
  if (notifBtn) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const badge = notifBtn.querySelector(".badge-dot");
      if (badge) {
        badge.style.display = "none";
      }
    });
  }

  const searchInput = document.getElementById("topbarSearchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim() !== "") {
        if (typeof showToast === "function") {
          showToast({
            title: "Global Search",
            message: `Searching system records for "${searchInput.value.trim()}"...`,
            type: "info",
            duration: 3000,
          });
        }
      }
    });
  }
}

/* 6. Nexus Enterprise Toast Notification System */
function showToast({
  title = "Notification",
  message = "",
  type = "success", // 'primary' | 'info' | 'success' | 'warning' | 'danger'
  duration = 4000,
  icon = null,
} = {}) {
  let container = document.getElementById("nexusToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "nexusToastContainer";
    container.className = "nexus-toast-container";
    document.body.appendChild(container);
  }

  const iconMap = {
    primary: "fa-solid fa-bell",
    info: "fa-solid fa-circle-info",
    success: "fa-solid fa-circle-check",
    warning: "fa-solid fa-triangle-exclamation",
    danger: "fa-solid fa-circle-xmark",
  };

  const validTypes = ["primary", "info", "success", "warning", "danger"];
  const toastType = validTypes.includes(type) ? type : "success";
  const toastIcon = icon || iconMap[toastType];

  const toastEl = document.createElement("div");
  toastEl.className = `nexus-toast nexus-toast-${toastType}`;
  toastEl.setAttribute("role", "alert");

  toastEl.innerHTML = `
    <div class="nexus-toast-accent-bar"></div>
    <div class="nexus-toast-icon-box">
      <i class="${toastIcon}"></i>
    </div>
    <div class="nexus-toast-content">
      <h6 class="nexus-toast-title">${title}</h6>
      ${message ? `<p class="nexus-toast-message">${message}</p>` : ""}
    </div>
    <button type="button" class="nexus-toast-close" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  const closeBtn = toastEl.querySelector(".nexus-toast-close");
  const dismiss = () => {
    if (toastEl.classList.contains("toast-hiding")) return;
    toastEl.classList.add("toast-hiding");
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    }, 250);
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", dismiss);
  }

  container.appendChild(toastEl);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return toastEl;
}

/* 7. Country Page Modal Handler */
function initCountryPageModal() {
  const countryModalEl = document.getElementById("countryFormModal");
  if (!countryModalEl) return;

  const countryModal =
    typeof bootstrap !== "undefined"
      ? bootstrap.Modal.getInstance(countryModalEl) || new bootstrap.Modal(countryModalEl)
      : null;

  const modalTitle = document.getElementById("countryModalTitle");
  const modalForm = document.getElementById("countryModalForm");
  const modalBadge = document.getElementById("modalHeaderBadge");
  const modalEyebrow = document.getElementById("modalHeaderEyebrow");

  const addBtn = document.getElementById("addCountryBtn");
  const editBtn = document.getElementById("editCountryBtn");

  if (addBtn && countryModal) {
    addBtn.addEventListener("click", () => {
      if (modalEyebrow) {
        modalEyebrow.innerHTML = `<span class="eyebrow-dot"></span> CREATE ENTRY`;
      }
      if (modalBadge) {
        modalBadge.innerHTML = `<i class="fa-solid fa-plus text-success"></i>`;
      }
      if (modalTitle) {
        modalTitle.innerHTML = `
          <i class="fa-solid fa-plus text-success me-2"></i>
          <span>Create New Country</span>
        `;
      }
      if (modalForm) modalForm.reset();
      countryModal.show();
    });
  }

  if (editBtn && countryModal) {
    editBtn.addEventListener("click", () => {
      if (modalEyebrow) {
        modalEyebrow.innerHTML = `<span class="eyebrow-dot"></span> EDIT CONFIGURATION`;
      }
      if (modalBadge) {
        modalBadge.innerHTML = `<i class="fa-solid fa-pen-to-square text-warning"></i>`;
      }
      if (modalTitle) {
        modalTitle.innerHTML = `
          <i class="fa-solid fa-pen-to-square text-warning me-2"></i>
          <span>Update Country Information</span>
        `;
      }
      const elCode = document.getElementById("modalCountryCode");
      const elName = document.getElementById("modalCountryName");
      const elRegion = document.getElementById("modalCountryRegion");
      const elDial = document.getElementById("modalDialCode");
      const elPriority = document.getElementById("modalCountryPriority");
      const elStatus = document.getElementById("modalCountryStatus");

      if (elCode) elCode.value = "VN";
      if (elName) elName.value = "Vietnam";
      if (elRegion) elRegion.value = "Asia";
      if (elDial) elDial.value = "+84";
      if (elPriority) elPriority.value = "High";
      if (elStatus) elStatus.value = "Active";

      countryModal.show();
    });
  }

  const deleteBtn = document.getElementById("deleteCountryBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      showToast({
        title: "Record Deleted",
        message: "Selected country record has been removed from system database.",
        type: "danger",
        duration: 4000,
      });
    });
  }

  const applyCountryFilterBtn = document.getElementById("applyCountryFilterBtn");
  if (applyCountryFilterBtn) {
    applyCountryFilterBtn.addEventListener("click", () => {
      showToast({
        title: "Filters Applied",
        message: "Country dataset refined based on selected region, priority, and status criteria.",
        type: "success",
        duration: 3500,
      });
    });
  }

  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (countryModal) countryModal.hide();

      const isEdit = modalTitle && modalTitle.innerText.toLowerCase().includes("update");

      showToast({
        title: isEdit ? "Changes Saved" : "Country Created",
        message: isEdit
          ? "Country information has been updated successfully."
          : "New country record has been created successfully.",
        type: "success",
        duration: 4000,
      });
    });
  }

  // Initialize Import Modal handler
  initCountryImportModal();
  // Initialize Export Modal handler
  initCountryExportModal();
}

/* 8. Country Import Modal Handler & Dropzone Logic */
function initCountryImportModal() {
  const importModalEl = document.getElementById("countryImportModal");
  const importBtn = document.getElementById("importCountryBtn");
  if (!importModalEl) return;

  const importModal =
    typeof bootstrap !== "undefined"
      ? bootstrap.Modal.getInstance(importModalEl) || new bootstrap.Modal(importModalEl)
      : null;

  if (importBtn && importModal) {
    importBtn.addEventListener("click", () => {
      importModal.show();
    });
  }

  const dropzone = document.getElementById("importDropzone");
  const fileInput = document.getElementById("importFileInput");
  const browseBtn = document.getElementById("browseFileBtn");
  const previewCard = document.getElementById("importFilePreview");
  const fileNameText = document.getElementById("fileNameText");
  const fileSizeText = document.getElementById("fileSizeText");
  const removeFileBtn = document.getElementById("removeFileBtn");
  const importForm = document.getElementById("countryImportForm");
  const processBtn = document.getElementById("processImportBtn");

  const progressContainer = document.getElementById("importProgressContainer");
  const progressStatusText = document.getElementById("importProgressStatusText");
  const progressPercentText = document.getElementById("importProgressPercentText");
  const progressBar = document.getElementById("importProgressBar");

  let selectedFile = null;
  let progressInterval = null;

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function resetProgressBar() {
    if (progressInterval) clearInterval(progressInterval);
    if (progressContainer) progressContainer.classList.add("d-none");
    if (progressBar) {
      progressBar.style.width = "0%";
      progressBar.setAttribute("aria-valuenow", "0");
    }
    if (progressPercentText) progressPercentText.textContent = "0%";
    if (progressStatusText) progressStatusText.textContent = "Parsing spreadsheet data...";
  }

  function handleFileSelect(file) {
    if (!file) return;
    selectedFile = file;

    if (fileNameText) fileNameText.textContent = file.name;
    if (fileSizeText) fileSizeText.textContent = formatBytes(file.size);

    if (previewCard) previewCard.classList.remove("d-none");
    resetProgressBar();
  }

  function clearSelectedFile() {
    selectedFile = null;
    if (fileInput) fileInput.value = "";
    if (previewCard) previewCard.classList.add("d-none");
    if (fileNameText) fileNameText.textContent = "";
    if (fileSizeText) fileSizeText.textContent = "";
    resetProgressBar();
  }

  if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => {
      fileInput.click();
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearSelectedFile();
    });
  }

  if (importForm) {
    importForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!selectedFile && fileInput && (!fileInput.files || fileInput.files.length === 0)) {
        showToast({
          title: "File Required",
          message: "Please choose an Excel (.xlsx) or CSV file to import.",
          type: "warning",
          duration: 4000,
        });
        return;
      }

      if (processBtn) {
        processBtn.disabled = true;
        processBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Processing...`;
      }

      // Show Progress Bar and start animation
      if (progressContainer) progressContainer.classList.remove("d-none");
      let currentProgress = 0;

      if (progressInterval) clearInterval(progressInterval);

      progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 10;
        if (currentProgress > 100) currentProgress = 100;

        if (progressBar) {
          progressBar.style.width = currentProgress + "%";
          progressBar.setAttribute("aria-valuenow", currentProgress);
        }
        if (progressPercentText) {
          progressPercentText.textContent = currentProgress + "%";
        }

        if (progressStatusText) {
          if (currentProgress < 30) {
            progressStatusText.textContent = "Reading & parsing file data...";
          } else if (currentProgress < 70) {
            progressStatusText.textContent = "Validating country ISO records...";
          } else if (currentProgress < 100) {
            progressStatusText.textContent = "Saving country records to database...";
          } else {
            progressStatusText.textContent = "Import completed successfully!";
          }
        }

        if (currentProgress >= 100) {
          clearInterval(progressInterval);

          setTimeout(() => {
            if (importModal) importModal.hide();

            showToast({
              title: "Import Successful",
              message: `Successfully processed "${selectedFile ? selectedFile.name : "data file"}" and updated country records.`,
              type: "success",
              duration: 4500,
            });

            clearSelectedFile();
            if (processBtn) {
              processBtn.disabled = false;
              processBtn.innerHTML = `<i class="fa-solid fa-file-import me-1"></i> Start Import`;
            }
          }, 400);
        }
      }, 150);
    });
  }
}

/* 9. Country Export Modal Handler & Scope Selection Logic */
function initCountryExportModal() {
  const exportModalEl = document.getElementById("countryExportModal");
  const exportBtn = document.getElementById("exportCountryBtn");
  if (!exportModalEl) return;

  const exportModal =
    typeof bootstrap !== "undefined"
      ? bootstrap.Modal.getInstance(exportModalEl) || new bootstrap.Modal(exportModalEl)
      : null;

  if (exportBtn && exportModal) {
    exportBtn.addEventListener("click", () => {
      exportModal.show();
    });
  }

  const exportForm = document.getElementById("countryExportForm");
  const processExportBtn = document.getElementById("processExportBtn");
  const exportProgressContainer = document.getElementById("exportProgressContainer");
  const exportProgressStatusText = document.getElementById("exportProgressStatusText");
  const exportProgressPercentText = document.getElementById("exportProgressPercentText");
  const exportProgressBar = document.getElementById("exportProgressBar");

  let exportInterval = null;

  function resetExportProgress() {
    if (exportInterval) clearInterval(exportInterval);
    if (exportProgressContainer) exportProgressContainer.classList.add("d-none");
    if (exportProgressBar) {
      exportProgressBar.style.width = "0%";
      exportProgressBar.setAttribute("aria-valuenow", "0");
    }
    if (exportProgressPercentText) exportProgressPercentText.textContent = "0%";
    if (exportProgressStatusText) exportProgressStatusText.textContent = "Generating export file...";
  }

  if (exportForm) {
    exportForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const selectedScopeInput = document.querySelector('input[name="exportScope"]:checked');
      const scopeValue = selectedScopeInput ? selectedScopeInput.value : "all";

      let scopeLabel = "all country data (120 items)";
      if (scopeValue === "current") {
        scopeLabel = "current page (10 items)";
      } else if (scopeValue === "selected") {
        scopeLabel = "selected items (3 items)";
      }

      if (processExportBtn) {
        processExportBtn.disabled = true;
        processExportBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Exporting...`;
      }

      if (exportProgressContainer) exportProgressContainer.classList.remove("d-none");
      let currentProgress = 0;

      if (exportInterval) clearInterval(exportInterval);

      exportInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 18) + 12;
        if (currentProgress > 100) currentProgress = 100;

        if (exportProgressBar) {
          exportProgressBar.style.width = currentProgress + "%";
          exportProgressBar.setAttribute("aria-valuenow", currentProgress);
        }
        if (exportProgressPercentText) {
          exportProgressPercentText.textContent = currentProgress + "%";
        }

        if (exportProgressStatusText) {
          if (currentProgress < 30) {
            exportProgressStatusText.textContent = "Preparing export dataset...";
          } else if (currentProgress < 75) {
            exportProgressStatusText.textContent = "Generating Excel spreadsheet...";
          } else if (currentProgress < 100) {
            exportProgressStatusText.textContent = "Finalizing file download...";
          } else {
            exportProgressStatusText.textContent = "Export completed successfully!";
          }
        }

        if (currentProgress >= 100) {
          clearInterval(exportInterval);

          setTimeout(() => {
            if (exportModal) exportModal.hide();

            showToast({
              title: "Export Completed",
              message: `Successfully exported ${scopeLabel} into Excel file.`,
              type: "success",
              duration: 4500,
            });

            resetExportProgress();
            if (processExportBtn) {
              processExportBtn.disabled = false;
              processExportBtn.innerHTML = `<i class="fa-solid fa-file-export me-1"></i> Start Export`;
            }
          }, 400);
        }
      }, 140);
    });
  }
}

// Expose globally
window.showToast = showToast;
window.initCountryPageModal = initCountryPageModal;
window.initCountryImportModal = initCountryImportModal;
window.initCountryExportModal = initCountryExportModal;

/* Country Management Dataset & HTML Table Renderer */
function generateCountryDataset() {
  const seedCountries = [
    { code: "VN", countryName: "Việt Nam", capital: "Hà Nội", region: "Asia", basePop: 98186856, priority: "High" },
    { code: "US", countryName: "United States", capital: "Washington, D.C.", region: "Americas", basePop: 331893745, priority: "High" },
    { code: "JP", countryName: "Japan", capital: "Tokyo", region: "Asia", basePop: 125507472, priority: "High" },
    { code: "DE", countryName: "Germany", capital: "Berlin", region: "Europe", basePop: 83190556, priority: "Standard" },
    { code: "GB", countryName: "United Kingdom", capital: "London", region: "Europe", basePop: 67326569, priority: "High" },
    { code: "FR", countryName: "France", capital: "Paris", region: "Europe", basePop: 67749632, priority: "Standard" },
    { code: "KR", countryName: "South Korea", capital: "Seoul", region: "Asia", basePop: 51744876, priority: "High" },
    { code: "SG", countryName: "Singapore", capital: "Singapore", region: "Asia", basePop: 5453600, priority: "High" },
    { code: "AU", countryName: "Australia", capital: "Canberra", region: "Oceania", basePop: 25688079, priority: "Standard" },
    { code: "CA", countryName: "Canada", capital: "Ottawa", region: "Americas", basePop: 38246108, priority: "Standard" },
    { code: "TH", countryName: "Thailand", capital: "Bangkok", region: "Asia", basePop: 71601103, priority: "Standard" },
    { code: "CN", countryName: "China", capital: "Beijing", region: "Asia", basePop: 1412360000, priority: "High" },
    { code: "IN", countryName: "India", capital: "New Delhi", region: "Asia", basePop: 1408044253, priority: "High" },
    { code: "BR", countryName: "Brazil", capital: "Brasília", region: "Americas", basePop: 214326223, priority: "Low" },
    { code: "IT", countryName: "Italy", capital: "Rome", region: "Europe", basePop: 59066225, priority: "Standard" },
    { code: "ES", countryName: "Spain", capital: "Madrid", region: "Europe", basePop: 47415750, priority: "Standard" },
    { code: "NL", countryName: "Netherlands", capital: "Amsterdam", region: "Europe", basePop: 17530000, priority: "Standard" },
    { code: "SE", countryName: "Sweden", capital: "Stockholm", region: "Europe", basePop: 10420000, priority: "Low" },
    { code: "CH", countryName: "Switzerland", capital: "Bern", region: "Europe", basePop: 8700000, priority: "High" },
    { code: "AE", countryName: "United Arab Emirates", capital: "Abu Dhabi", region: "Asia", basePop: 9890400, priority: "High" },
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
  return countryData;
}

function initCountryGrid() {
  if (!window.allCountryData || window.allCountryData.length === 0) {
    window.allCountryData = generateCountryDataset();
  }
  const countryData = window.allCountryData;
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

  // Handle select all checkbox
  const selectAll = document.getElementById("selectAllCountry");
  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      document
        .querySelectorAll('#countryListTable tbody input[type="checkbox"]')
        .forEach((cb) => (cb.checked = e.target.checked));
    });
  }
}

function renderCountryTableRows(data) {
  const tbody = document.getElementById("countryTableBody");
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13" class="text-center py-4 text-muted">
          <i class="fa-solid fa-folder-open me-2"></i>No country records found.
        </td>
      </tr>
    `;
    return;
  }

  const gradientMap = [
    "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    "linear-gradient(135deg, #10b981, #047857)",
    "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    "linear-gradient(135deg, #f59e0b, #b45309)",
    "linear-gradient(135deg, #ec4899, #be185d)",
    "linear-gradient(135deg, #06b6d4, #0e7490)",
  ];

  const REGION_BADGES = {
    Asia: { bg: "badge-blue", icon: "fa-globe-asia" },
    Europe: { bg: "badge-purple", icon: "fa-earth-europe" },
    Americas: { bg: "badge-orange", icon: "fa-earth-americas" },
    Oceania: { bg: "badge-cyan", icon: "fa-earth-oceania" },
    Africa: { bg: "badge-rose", icon: "fa-earth-africa" },
  };

  const PRIORITY_BADGES = {
    High: { class: "badge-red", icon: "fa-fire", label: "High Priority" },
    Standard: { class: "badge-indigo", icon: "fa-layer-group", label: "Standard" },
    Low: { class: "badge-slate", icon: "fa-arrow-down-short-wide", label: "Low" },
  };

  tbody.innerHTML = data
    .map((item) => {
      const code = item.code || "VN";
      const initials = code.substring(0, 2).toUpperCase();
      const charSum = (code.charCodeAt(0) || 0) + (code.charCodeAt(1) || 0);
      const bgGrad = gradientMap[charSum % gradientMap.length];
      const reg = REGION_BADGES[item.region] || { bg: "badge-slate", icon: "fa-globe" };
      const prio = PRIORITY_BADGES[item.priority] || { class: "badge-slate", icon: "fa-circle-info", label: item.priority };
      const statusClass = item.active ? "status-active" : "status-resigned";
      const statusIcon = item.active ? "fa-circle" : "fa-circle-xmark";
      const statusLabel = item.active ? "Active" : "Inactive";

      return `
        <tr>
          <td>
            <input type="checkbox" class="country-row-cb" aria-label="Select ${item.countryName}" />
          </td>
          <td>
            <span class="badge-soft badge-blue">#${code}</span>
          </td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div style="background:${bgGrad}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; color:#fff; flex-shrink:0;">
                ${initials}
              </div>
              <div>
                <div class="fw-semibold text-main">${item.countryName}</div>
                <div class="text-muted small">${item.capital ? "Capital: " + item.capital : ""}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="text-muted small">
              <i class="fa-solid fa-location-dot text-primary me-1"></i>${item.capital || "—"}
            </span>
          </td>
          <td>
            <span class="badge-soft ${reg.bg}">
              <i class="fa-solid ${reg.icon} me-1"></i>${item.region}
            </span>
          </td>
          <td>
            <span class="fw-semibold text-main">
              <i class="fa-solid fa-users text-muted me-1 small"></i>${Number(item.population).toLocaleString()}
            </span>
          </td>
          <td>
            <span class="badge-soft ${prio.class}">
              <i class="fa-solid ${prio.icon} me-1"></i>${prio.label}
            </span>
          </td>
          <td>
            <span class="emp-badge ${statusClass}">
              <i class="fa-solid ${statusIcon}"></i> ${statusLabel}
            </span>
          </td>
          <td>
            <span class="text-muted small">
              <i class="fa-regular fa-user me-1"></i>${item.createdBy}
            </span>
          </td>
          <td><span class="text-muted small">${item.createdAt}</span></td>
          <td>
            <span class="text-muted small">
              <i class="fa-regular fa-user me-1"></i>${item.updatedBy}
            </span>
          </td>
          <td><span class="text-muted small">${item.updatedAt}</span></td>
          <td><span class="text-muted small fst-italic">${item.note || "—"}</span></td>
        </tr>
      `;
    })
    .join("");
}

window.initCountryGrid = initCountryGrid;
window.renderCountryTableRows = renderCountryTableRows;

/* ======================================================
   10. EMPLOYEE DIRECTORY — DATA & CONTROLLER LOGIC
   ====================================================== */
const EMP_DATA = {
  EMP001: {
    name: "Linh Tran",
    role: "Senior UX Designer",
    id: "#EMP001",
    avatar: "https://i.pravatar.cc/150?img=47",
    initials: null,
    avatarGrad: null,
    dept: "Design",
    deptIcon: "fa-paintbrush",
    deptClass: "dept-design",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Lan Hoang",
    email: "linh.tran@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "January 2022",
    phone: "+84 90 123 4567",
    dob: "15 May 1992",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — HCMC University of Fine Arts",
    yearsExp: 7,
    salary: "28,000,000 VND",
    reportCount: 2,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "123 Le Loi, Ben Nghe Ward, District 1, HCMC",
    tempAddress: "123 Le Loi, Ben Nghe Ward, District 1, HCMC",
    cccd: "079192001234",
    cccdDate: "12/04/2021",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8492018239",
    dependents: 1,
    bhxh: "VN-7601-0012345",
    bhyt: "DN4-7601-0012345",
    bankAccount: "0071001234567 — Vietcombank",
    skills: ["UI/UX Design", "Figma", "Design System", "User Research", "Prototyping"],
  },
  EMP002: {
    name: "Minh Nguyen",
    role: "Backend Engineer",
    id: "#EMP002",
    avatar: "https://i.pravatar.cc/150?img=12",
    initials: null,
    avatarGrad: null,
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Remote",
    statusClass: "status-remote",
    manager: "Phuong Vo",
    email: "minh.nguyen@nexusost.com",
    location: "Ha Noi (Remote)",
    joined: "March 2021",
    phone: "+84 91 234 5678",
    dob: "20 Aug 1990",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Master — Hanoi University of Science and Tech",
    yearsExp: 9,
    salary: "35,000,000 VND",
    reportCount: 0,
    contractTerm: "36 Months (15/03/2021 – 15/03/2024)",
    permAddress: "45 Tran Phu, Ba Dinh District, Hanoi",
    tempAddress: "45 Tran Phu, Ba Dinh District, Hanoi",
    cccd: "001190005678",
    cccdDate: "05/09/2020",
    cccdPlace: "Police Dept for Admin Management — Hanoi",
    taxCode: "8501928374",
    dependents: 2,
    bhxh: "VN-0101-0023456",
    bhyt: "DN4-0101-0023456",
    bankAccount: "1903456789012 — Techcombank",
    skills: ["Node.js", "PostgreSQL", "Docker", "Microservices", "Redis", "GraphQL"],
  },
  EMP003: {
    name: "Thu Pham",
    role: "HR Manager",
    id: "#EMP003",
    avatar: null,
    initials: "TP",
    avatarGrad: "linear-gradient(135deg,#8b5cf6,#6366f1)",
    dept: "Human Resources",
    deptIcon: "fa-people-roof",
    deptClass: "dept-hr",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Maternity Leave",
    statusClass: "status-maternity",
    manager: "CEO Board",
    email: "thu.pham@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "June 2020",
    phone: "+84 92 345 6789",
    dob: "10 Feb 1988",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — University of Economics HCMC",
    yearsExp: 10,
    salary: "32,000,000 VND",
    reportCount: 4,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "78 Nguyen Hue, District 1, HCMC",
    tempAddress: "78 Nguyen Hue, District 1, HCMC",
    cccd: "079188009876",
    cccdDate: "18/11/2019",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8392017482",
    dependents: 1,
    bhxh: "VN-7601-0034567",
    bhyt: "DN4-7601-0034567",
    bankAccount: "0071009876543 — Vietcombank",
    skills: ["Talent Acquisition", "Employee Relations", "Payroll", "Labor Law", "KPI Management"],
  },
  EMP004: {
    name: "Tuan Le",
    role: "DevOps Engineer",
    id: "#EMP004",
    avatar: "https://i.pravatar.cc/150?img=68",
    initials: null,
    avatarGrad: null,
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Phuong Vo",
    email: "tuan.le@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "November 2022",
    phone: "+84 93 456 7890",
    dob: "03 Dec 1994",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — VNUHCM-University of Information Tech",
    yearsExp: 5,
    salary: "30,000,000 VND",
    reportCount: 0,
    contractTerm: "12 Months (01/11/2022 – 01/11/2023)",
    permAddress: "12 Vo Van Ngan, Thu Duc City, HCMC",
    tempAddress: "12 Vo Van Ngan, Thu Duc City, HCMC",
    cccd: "079194003456",
    cccdDate: "22/02/2022",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8601928371",
    dependents: 0,
    bhxh: "VN-7601-0045678",
    bhyt: "DN4-7601-0045678",
    bankAccount: "1012345678 — MB Bank",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Prometheus", "Linux Administration"],
  },
  EMP005: {
    name: "Ha Vo",
    role: "Product Manager",
    id: "#EMP005",
    avatar: null,
    initials: "HV",
    avatarGrad: "linear-gradient(135deg,#f59e0b,#ef4444)",
    dept: "Product",
    deptIcon: "fa-cubes",
    deptClass: "dept-product",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "CEO Board",
    email: "ha.vo@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "September 2020",
    phone: "+84 94 567 8901",
    dob: "28 Jul 1991",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — Foreign Trade University HCMC",
    yearsExp: 8,
    salary: "40,000,000 VND",
    reportCount: 3,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "56 Cach Mang Thang 8, District 3, HCMC",
    tempAddress: "56 Cach Mang Thang 8, District 3, HCMC",
    cccd: "079191007890",
    cccdDate: "14/07/2020",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8291038475",
    dependents: 1,
    bhxh: "VN-7601-0056789",
    bhyt: "DN4-7601-0056789",
    bankAccount: "0071005678901 — Vietcombank",
    skills: ["Product Strategy", "Agile/Scrum", "Data Analytics", "Roadmapping", "Jira"],
  },
  EMP006: {
    name: "Duc Hoang",
    role: "Frontend Developer",
    id: "#EMP006",
    avatar: "https://i.pravatar.cc/150?img=53",
    initials: null,
    avatarGrad: null,
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Part-time",
    contractClass: "contract-parttime",
    status: "Active",
    statusClass: "status-active",
    manager: "Phuong Vo",
    email: "duc.hoang@nexusost.com",
    location: "Da Nang",
    joined: "February 2023",
    phone: "+84 95 678 9012",
    dob: "11 Nov 1996",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — University of Science and Tech - Da Nang",
    yearsExp: 3,
    salary: "15,000,000 VND",
    reportCount: 0,
    contractTerm: "12 Months (01/02/2023 – 01/02/2024)",
    permAddress: "89 Nguyen Van Linh, Hai Chau District, Da Nang",
    tempAddress: "89 Nguyen Van Linh, Hai Chau District, Da Nang",
    cccd: "048196001234",
    cccdDate: "10/10/2021",
    cccdPlace: "Police Dept for Admin Management — Da Nang",
    taxCode: "8701928374",
    dependents: 0,
    bhxh: "VN-4801-0067890",
    bhyt: "DN4-4801-0067890",
    bankAccount: "0123456789 — VPBank",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "HTML5/CSS3"],
  },
  EMP007: {
    name: "Mai Dang",
    role: "Financial Analyst",
    id: "#EMP007",
    avatar: "https://i.pravatar.cc/150?img=32",
    initials: null,
    avatarGrad: null,
    dept: "Finance",
    deptIcon: "fa-coins",
    deptClass: "dept-finance",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Probation",
    statusClass: "status-probation",
    manager: "Long Truong",
    email: "mai.dang@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "May 2024",
    phone: "+84 96 789 0123",
    dob: "05 Apr 1995",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — Banking University HCMC",
    yearsExp: 4,
    salary: "22,000,000 VND",
    reportCount: 0,
    contractTerm: "02 Months Probation (01/05/2024 – 01/07/2024)",
    permAddress: "234 Dien Bien Phu, Binh Thanh District, HCMC",
    tempAddress: "234 Dien Bien Phu, Binh Thanh District, HCMC",
    cccd: "079195004567",
    cccdDate: "05/05/2022",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8801928376",
    dependents: 0,
    bhxh: "—",
    bhyt: "DN4-7601-0078901",
    bankAccount: "0071007890123 — Vietcombank",
    skills: ["Financial Modeling", "Excel Advanced", "Power BI", "Budgeting", "Auditing"],
  },
  EMP008: {
    name: "Nam Bui",
    role: "Sales Executive",
    id: "#EMP008",
    avatar: null,
    initials: "NB",
    avatarGrad: "linear-gradient(135deg,#10b981,#059669)",
    dept: "Sales",
    deptIcon: "fa-chart-line",
    deptClass: "dept-sales",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Trinh Do",
    email: "nam.bui@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "August 2021",
    phone: "+84 97 890 1234",
    dob: "19 Sep 1993",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — HCMC University of Economics and Finance",
    yearsExp: 6,
    salary: "20,000,000 VND",
    reportCount: 0,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "12 Ly Thường Kiệt, District 10, HCMC",
    tempAddress: "12 Ly Thường Kiệt, District 10, HCMC",
    cccd: "079193006789",
    cccdDate: "12/12/2020",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8901928375",
    dependents: 0,
    bhxh: "VN-7601-0089012",
    bhyt: "DN4-7601-0089012",
    bankAccount: "1089012345 — ACB",
    skills: ["B2B Sales", "CRM", "Negotiation", "Lead Generation", "Client Pitching"],
  },
  EMP009: {
    name: "Khoa Tran",
    role: "QA Lead",
    id: "#EMP009",
    avatar: "https://i.pravatar.cc/150?img=11",
    initials: null,
    avatarGrad: null,
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Phuong Vo",
    email: "khoa.tran@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "October 2019",
    phone: "+84 90 901 2345",
    dob: "30 Jan 1989",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — VNUHCM-University of Science",
    yearsExp: 10,
    salary: "33,000,000 VND",
    reportCount: 3,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "34 Phan Xich Long, Phu Nhuan District, HCMC",
    tempAddress: "34 Phan Xich Long, Phu Nhuan District, HCMC",
    cccd: "079189001234",
    cccdDate: "01/06/2018",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8001928374",
    dependents: 2,
    bhxh: "VN-7601-0090123",
    bhyt: "DN4-7601-0090123",
    bankAccount: "0071009012345 — Vietcombank",
    skills: ["Automation Testing", "Cypress", "Selenium", "JMeter", "API Testing", "CI Test Integration"],
  },
  EMP010: {
    name: "Lan Hoang",
    role: "Design Lead",
    id: "#EMP010",
    avatar: "https://i.pravatar.cc/150?img=25",
    initials: null,
    avatarGrad: null,
    dept: "Design",
    deptIcon: "fa-paintbrush",
    deptClass: "dept-design",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Khoa Tran",
    email: "lan.hoang@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "July 2019",
    phone: "+84 91 123 4567",
    dob: "07 Dec 1987",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Master — HCMC University of Fine Arts",
    yearsExp: 12,
    salary: "45,000,000 VND",
    reportCount: 3,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "78 Hai Ba Trung, Ben Nghe Ward, District 1, HCMC",
    tempAddress: "78 Hai Ba Trung, Ben Nghe Ward, District 1, HCMC",
    cccd: "079187101234",
    cccdDate: "01/12/2020",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8501108901",
    dependents: 0,
    bhxh: "VN-7601-0101234",
    bhyt: "HM4-7601-0101234",
    bankAccount: "0101234567890 — VPBank",
    skills: ["Brand Identity", "Figma", "Illustration", "Design Systems", "Motion Design"],
  },
  EMP011: {
    name: "Phuong Vo",
    role: "Engineering Lead",
    id: "#EMP011",
    avatar: "https://i.pravatar.cc/150?img=60",
    initials: null,
    avatarGrad: null,
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Remote",
    statusClass: "status-remote",
    manager: "Khoa Tran",
    email: "phuong.vo@nexusost.com",
    location: "Da Nang (Remote)",
    joined: "April 2018",
    phone: "+84 93 234 5678",
    dob: "14 Oct 1989",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — University of Science and Tech - Da Nang",
    yearsExp: 11,
    salary: "50,000,000 VND",
    reportCount: 6,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "99 Bach Dang, Hai Chau 1 Ward, Hai Chau District, Da Nang",
    tempAddress: "99 Bach Dang, Hai Chau 1 Ward, Hai Chau District, Da Nang",
    cccd: "048189112345",
    cccdDate: "10/10/2021",
    cccdPlace: "Police Dept for Admin Management — Da Nang",
    taxCode: "8512209012",
    dependents: 1,
    bhxh: "VN-4801-0112345",
    bhyt: "HM4-4801-0112345",
    bankAccount: "0112345678901 — BIDV",
    skills: ["Python", "Kubernetes", "CI/CD", "System Design", "Code Review", "Mentoring"],
  },
  EMP012: {
    name: "Hung Dao",
    role: "Brand Designer",
    id: "#EMP012",
    avatar: null,
    initials: "HD",
    avatarGrad: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    dept: "Design",
    deptIcon: "fa-paintbrush",
    deptClass: "dept-design",
    contract: "Freelance",
    contractClass: "contract-freelance",
    status: "Resigned",
    statusClass: "status-resigned",
    manager: "Lan Hoang",
    email: "hung.dao@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "December 2021",
    phone: "+84 94 345 6789",
    dob: "25 Jul 1993",
    gender: "Male",
    nationality: "Vietnamese",
    education: "College — HCMC College of Fine Arts",
    yearsExp: 6,
    salary: "20,000,000 VND",
    reportCount: 0,
    contractTerm: "Project-based (Freelance)",
    permAddress: "12 Cong Hoa, Ward 4, Tan Binh District, HCMC",
    tempAddress: "12 Cong Hoa, Ward 4, Tan Binh District, HCMC",
    cccd: "079193012345",
    cccdDate: "15/03/2019",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8523310123",
    dependents: 0,
    bhxh: "—",
    bhyt: "—",
    bankAccount: "0123456789012 — MB Bank",
    skills: ["Photoshop", "Illustrator", "3D Blender", "Typography", "Packaging"],
  },
  EMP013: {
    name: "Ngan Le",
    role: "Scrum Master",
    id: "#EMP013",
    avatar: "https://i.pravatar.cc/150?img=44",
    initials: null,
    avatarGrad: null,
    dept: "Product",
    deptIcon: "fa-cubes",
    deptClass: "dept-product",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Ha Vo",
    email: "ngan.le@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "August 2020",
    phone: "+84 96 456 7890",
    dob: "18 Mar 1991",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — VNUHCM-University of Social Sciences and Humanities",
    yearsExp: 8,
    salary: "34,000,000 VND",
    reportCount: 0,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "88 Tran Hung Dao, District 5, HCMC",
    tempAddress: "88 Tran Hung Dao, District 5, HCMC",
    cccd: "079191013456",
    cccdDate: "20/07/2021",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8534411234",
    dependents: 1,
    bhxh: "VN-7601-0134567",
    bhyt: "HM4-7601-0134567",
    bankAccount: "0134567890123 — Techcombank",
    skills: ["Agile/Scrum", "Kanban", "Facilitation", "Jira", "Conflict Resolution"],
  },
  EMP014: {
    name: "Son Hoang",
    role: "Data Engineer",
    id: "#EMP014",
    avatar: null,
    initials: "SH",
    avatarGrad: "linear-gradient(135deg,#84cc16,#10b981)",
    dept: "Engineering",
    deptIcon: "fa-code",
    deptClass: "dept-engineering",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Phuong Vo",
    email: "son.hoang@nexusost.com",
    location: "Ha Noi",
    joined: "June 2021",
    phone: "+84 97 567 8901",
    dob: "30 Dec 1992",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — Hanoi University of Science and Tech",
    yearsExp: 7,
    salary: "38,000,000 VND",
    reportCount: 0,
    contractTerm: "36 Months (01/06/2021 – 01/06/2024)",
    permAddress: "15 Thuy Khue, Tay Ho District, Hanoi",
    tempAddress: "15 Thuy Khue, Tay Ho District, Hanoi",
    cccd: "001192014567",
    cccdDate: "05/11/2020",
    cccdPlace: "Police Dept for Admin Management — Hanoi",
    taxCode: "8545512345",
    dependents: 0,
    bhxh: "VN-0101-0145678",
    bhyt: "HM4-0101-0145678",
    bankAccount: "0145678901234 — VietinBank",
    skills: ["Apache Spark", "Python", "SQL", "Airflow", "ETL Pipelines", "Snowflake"],
  },
  EMP015: {
    name: "Thao Vu",
    role: "Content Strategist",
    id: "#EMP015",
    avatar: "https://i.pravatar.cc/150?img=38",
    initials: null,
    avatarGrad: null,
    dept: "Marketing",
    deptIcon: "fa-bullhorn",
    deptClass: "dept-marketing",
    contract: "Contract",
    contractClass: "contract-contract",
    status: "Remote",
    statusClass: "status-remote",
    manager: "Trinh Do",
    email: "thao.vu@nexusost.com",
    location: "Da Nang (Remote)",
    joined: "November 2023",
    phone: "+84 98 678 9012",
    dob: "09 May 1997",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — Danang University of Foreign Language Studies",
    yearsExp: 4,
    salary: "21,000,000 VND",
    reportCount: 0,
    contractTerm: "12 Months (01/11/2023 – 01/11/2024)",
    permAddress: "220 Nguyen Huu Tho, Cam Le District, Da Nang",
    tempAddress: "220 Nguyen Huu Tho, Cam Le District, Da Nang",
    cccd: "048197015678",
    cccdDate: "14/02/2022",
    cccdPlace: "Police Dept for Admin Management — Da Nang",
    taxCode: "8556613456",
    dependents: 0,
    bhxh: "VN-4801-0156789",
    bhyt: "HM4-4801-0156789",
    bankAccount: "0156789012345 — TPBank",
    skills: ["Copywriting", "SEO", "Social Media", "Brand Storytelling", "Content Marketing"],
  },
  EMP016: {
    name: "Vy Ngo",
    role: "Talent Acquisition Lead",
    id: "#EMP016",
    avatar: null,
    initials: "VN",
    avatarGrad: "linear-gradient(135deg,#ec4899,#be185d)",
    dept: "Human Resources",
    deptIcon: "fa-people-roof",
    deptClass: "dept-hr",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Thu Pham",
    email: "vy.ngo@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "May 2022",
    phone: "+84 90 789 0123",
    dob: "16 Aug 1993",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Bachelor — VNUHCM-University of Economics and Law",
    yearsExp: 7,
    salary: "29,000,000 VND",
    reportCount: 2,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "45 Le Van Syt, Ward 13, District 3, HCMC",
    tempAddress: "45 Le Van Syt, Ward 13, District 3, HCMC",
    cccd: "079193016789",
    cccdDate: "19/09/2020",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8567714567",
    dependents: 0,
    bhxh: "VN-7601-0167890",
    bhyt: "HM4-7601-0167890",
    bankAccount: "0167890123456 — VIB",
    skills: ["Tech Recruiting", "Headhunting", "Employer Branding", "Interviewing", "ATS"],
  },
  EMP017: {
    name: "Long Truong",
    role: "Financial Controller",
    id: "#EMP017",
    avatar: "https://i.pravatar.cc/150?img=15",
    initials: null,
    avatarGrad: null,
    dept: "Finance",
    deptIcon: "fa-coins",
    deptClass: "dept-finance",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "CEO Board",
    email: "long.truong@nexusost.com",
    location: "Ha Noi",
    joined: "January 2019",
    phone: "+84 91 890 1234",
    dob: "22 Jan 1985",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Master — National Economics University Hanoi",
    yearsExp: 15,
    salary: "48,000,000 VND",
    reportCount: 5,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "102 Hoang Hoa Tham, Ba Dinh District, Hanoi",
    tempAddress: "102 Hoang Hoa Tham, Ba Dinh District, Hanoi",
    cccd: "001185017890",
    cccdDate: "03/04/2018",
    cccdPlace: "Police Dept for Admin Management — Hanoi",
    taxCode: "8578815678",
    dependents: 2,
    bhxh: "VN-0101-0178901",
    bhyt: "HM4-0101-0178901",
    bankAccount: "0178901234567 — Vietcombank",
    skills: ["Corporate Finance", "Tax Planning", "Accounting Standards", "Cashflow", "ERP Finance"],
  },
  EMP018: {
    name: "Quynh Nguyen",
    role: "UI Designer Intern",
    id: "#EMP018",
    avatar: "https://i.pravatar.cc/150?img=49",
    initials: null,
    avatarGrad: null,
    dept: "Design",
    deptIcon: "fa-paintbrush",
    deptClass: "dept-design",
    contract: "Internship",
    contractClass: "contract-internship",
    status: "Probation",
    statusClass: "status-probation",
    manager: "Lan Hoang",
    email: "quynh.nguyen@nexusost.com",
    location: "Da Nang",
    joined: "January 2024",
    phone: "+84 91 901 2345",
    dob: "11 Nov 2003",
    gender: "Female",
    nationality: "Vietnamese",
    education: "Undergraduate — FPT Polytechnic College",
    yearsExp: 0,
    salary: "5,000,000 VND",
    reportCount: 0,
    contractTerm: "03 Months (01/01/2024 – 01/04/2024)",
    permAddress: "12 Truong Dinh, Man Thai Ward, Son Tra District, Da Nang",
    tempAddress: "12 Truong Dinh, Man Thai Ward, Son Tra District, Da Nang",
    cccd: "048203189012",
    cccdDate: "08/11/2022",
    cccdPlace: "Police Dept for Admin Management — Da Nang",
    taxCode: "—",
    dependents: 0,
    bhxh: "—",
    bhyt: "HM4-4801-0189012",
    bankAccount: "0189012345678 — ACB",
    skills: ["Figma", "Canva", "UI Design", "Color Theory"],
  },
  EMP019: {
    name: "Kien Pham",
    role: "System Administrator",
    id: "#EMP019",
    avatar: null,
    initials: "KP",
    avatarGrad: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
    dept: "Operations",
    deptIcon: "fa-gears",
    deptClass: "dept-ops",
    contract: "Part-time",
    contractClass: "contract-parttime",
    status: "Active",
    statusClass: "status-active",
    manager: "Trang Nguyen",
    email: "kien.pham@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "July 2022",
    phone: "+84 93 012 3456",
    dob: "02 Sep 1991",
    gender: "Male",
    nationality: "Vietnamese",
    education: "Bachelor — HCM City University of Technology and Education",
    yearsExp: 8,
    salary: "18,000,000 VND",
    reportCount: 0,
    contractTerm: "12 Months (15/07/2022 – 15/07/2023)",
    permAddress: "44 Hoang Van Thu, Ward 9, Phu Nhuan District, HCMC",
    tempAddress: "44 Hoang Van Thu, Ward 9, Phu Nhuan District, HCMC",
    cccd: "079191190123",
    cccdDate: "28/08/2021",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8589916789",
    dependents: 1,
    bhxh: "VN-7601-0190123",
    bhyt: "HM4-7601-0190123",
    bankAccount: "0190123456789 — Sacombank",
    skills: ["Linux", "Networking", "VMware", "Bash Scripting", "IT Security"],
  },
  EMP020: {
    name: "Trinh Do",
    role: "Sales Director",
    id: "#EMP020",
    avatar: "https://i.pravatar.cc/150?img=26",
    initials: null,
    avatarGrad: null,
    dept: "Sales",
    deptIcon: "fa-chart-line",
    deptClass: "dept-sales",
    contract: "Full-time",
    contractClass: "contract-fulltime",
    status: "Active",
    statusClass: "status-active",
    manager: "Nam Bui",
    email: "trinh.do@nexusost.com",
    location: "Ho Chi Minh City",
    joined: "April 2019",
    phone: "+84 94 123 4567",
    dob: "24 Jun 1986",
    gender: "Female",
    nationality: "Vietnamese",
    education: "MBA — University of Economics HCMC",
    yearsExp: 14,
    salary: "52,000,000 VND",
    reportCount: 7,
    contractTerm: "Indefinite (Full-time)",
    permAddress: "112 Nguyen Van Troi, Ward 8, Phu Nhuan District, HCMC",
    tempAddress: "112 Nguyen Van Troi, Ward 8, Phu Nhuan District, HCMC",
    cccd: "079186201234",
    cccdDate: "18/06/2020",
    cccdPlace: "Police Dept for Admin Management — HCMC",
    taxCode: "8501017890",
    dependents: 2,
    bhxh: "VN-7601-0201234",
    bhyt: "HM4-7601-0201234",
    bankAccount: "0201234567890 — Vietcombank",
    skills: ["Enterprise Sales", "Account Management", "Salesforce", "Contract Negotiation"],
  },
};

// Status icon map
const STATUS_ICON = {
  Active: "fa-circle",
  Remote: "fa-laptop-house",
  Probation: "fa-hourglass-half",
  "Maternity Leave": "fa-baby",
  Resigned: "fa-ban",
};

// Open Employee Detail Modal
function openEmpModal(empId) {
  const raw = empId.replace("#", "");
  const d = EMP_DATA[raw];
  if (!d) return;

  // Avatar
  const avatarEl = document.getElementById("empModalAvatar");
  if (avatarEl) {
    if (d.avatar) {
      avatarEl.innerHTML = `<img src="${d.avatar}" alt="${d.name}">`;
    } else {
      avatarEl.innerHTML = `<div class="emp-avatar-initials" style="background:${d.avatarGrad}">${d.initials}</div>`;
    }
  }

  // Name / role
  const nameEl = document.getElementById("empModalName");
  if (nameEl) {
    nameEl.innerHTML = `
      <span>${d.name}</span>
      <span class="emp-card-id-chip ms-1">${d.id}</span>
    `;
  }
  const roleEl = document.getElementById("empModalRole");
  if (roleEl) roleEl.textContent = d.role;

  // Badges
  const badgesEl = document.getElementById("empModalBadges");
  if (badgesEl) {
    badgesEl.innerHTML = `
      <span class="emp-badge ${d.deptClass}"><i class="fa-solid ${d.deptIcon}"></i> ${d.dept}</span>
      <span class="emp-badge ${d.contractClass}"><i class="fa-solid fa-file-contract"></i> ${d.contract}</span>
      <span class="emp-badge ${d.statusClass}"><i class="fa-solid ${STATUS_ICON[d.status] || "fa-circle"}"></i> ${d.status}</span>
    `;
  }

  // Helper setter
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // Section 1: Contact & Org
  setTxt("empModalEmail", d.email || "—");
  setTxt("empModalPhone", d.phone || "—");
  setTxt("empModalManager", d.manager || "—");
  setTxt("empModalLocation", d.location || "—");
  setTxt("empModalJoined", d.joined || "—");
  setTxt("empModalSalary", d.salary || "—");
  setTxt("empModalContractTerm", d.contractTerm || "—");

  // Section 2: Personal Info
  setTxt("empModalDob", d.dob || "—");
  setTxt("empModalGender", d.gender || "—");
  setTxt("empModalNationality", d.nationality || "—");
  setTxt("empModalEducation", d.education || "—");
  setTxt("empModalPermAddress", d.permAddress || "—");
  setTxt("empModalTempAddress", d.tempAddress || "—");

  // Section 3: Legal, Insurance & Tax
  setTxt("empModalCccd", d.cccd || "—");
  setTxt("empModalCccdDate", d.cccdDate || "—");
  setTxt("empModalCccdPlace", d.cccdPlace || "—");
  setTxt("empModalTaxCode", d.taxCode || "—");
  setTxt("empModalDependents", String(d.dependents ?? "—"));
  setTxt("empModalBhxh", d.bhxh || "—");
  setTxt("empModalBhyt", d.bhyt || "—");

  // Section 4: Banking
  setTxt("empModalBankAccount", d.bankAccount || "—");

  // Stats mini-row
  setTxt("empModalStatYearsExp", (d.yearsExp || 0) + (d.yearsExp === 1 ? " year" : " yrs"));
  setTxt("empModalStatReportCount", d.reportCount || 0);
  setTxt("empModalStatSkillCount", d.skills ? d.skills.length : 0);

  // Skills
  const skillsEl = document.getElementById("empModalSkills");
  if (skillsEl) {
    const skillsHtml = (d.skills || [])
      .map(
        (sk) =>
          `<span class="emp-modal-skill-chip"><i class="fa-solid fa-tag"></i> ${sk}</span>`,
      )
      .join("");
    skillsEl.innerHTML =
      skillsHtml ||
      '<span style="color:var(--text-light);font-size:0.8rem">No skills listed</span>';
  }

  // Open — use Bootstrap Modal API
  const modalElem = document.getElementById("empDetailModal");
  if (modalElem && typeof bootstrap !== "undefined") {
    const _bsModal = bootstrap.Modal.getOrCreateInstance(modalElem);
    _bsModal.show();
  }
}

function initEmployeesPage() {
  // ── View Toggle ──
  const cardViewBtn = document.getElementById("cardViewBtn");
  const listViewBtn = document.getElementById("listViewBtn");
  const empCardView = document.getElementById("empCardView");
  const empListView = document.getElementById("empListView");

  if (cardViewBtn && listViewBtn && empCardView && empListView) {
    cardViewBtn.addEventListener("click", () => {
      cardViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
      empCardView.classList.remove("d-none");
      empListView.classList.add("d-none");
    });

    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("active");
      cardViewBtn.classList.remove("active");
      empListView.classList.remove("d-none");
      empCardView.classList.add("d-none");
    });
  }

  // ── Select All in List View ──
  const selectAll = document.getElementById("selectAllList");
  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      document
        .querySelectorAll('#empListTable tbody input[type="checkbox"]')
        .forEach((cb) => (cb.checked = e.target.checked));
    });
  }

  // ── Interactive Pagination Logic ──
  (function initPagination() {
    let currentPage = 1;
    let pageSize = 12;
    const totalEmployees = 248;
    let totalPages = 1;

    const empResultCount = document.getElementById("empResultCount");
    const empPageSizeSelect = document.getElementById("empPageSizeSelect");
    const empJumpInput = document.getElementById("empJumpInput");
    const empTotalPages = document.getElementById("empTotalPages");
    const empPageJumpForm = document.getElementById("empPageJumpForm");

    const empFirstBtn = document.getElementById("empFirstBtn");
    const empPrevBtn = document.getElementById("empPrevBtn");
    const empNextBtn = document.getElementById("empNextBtn");
    const empLastBtn = document.getElementById("empLastBtn");
    const empPageNumbersGroup = document.getElementById("empPageNumbersGroup");

    function updatePaginationUI() {
      totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalEmployees);

      if (empResultCount) {
        empResultCount.innerHTML = `Showing <strong>${startItem} – ${endItem}</strong> of <strong>${totalEmployees}</strong> employees`;
      }
      if (empTotalPages) empTotalPages.textContent = totalPages;
      if (empJumpInput) {
        empJumpInput.value = currentPage;
        empJumpInput.max = totalPages;
      }

      // Toggle disabled state on nav buttons
      if (empFirstBtn) empFirstBtn.disabled = currentPage === 1;
      if (empPrevBtn) empPrevBtn.disabled = currentPage === 1;
      if (empNextBtn) empNextBtn.disabled = currentPage === totalPages;
      if (empLastBtn) empLastBtn.disabled = currentPage === totalPages;

      renderPageNumbers();
    }

    function renderPageNumbers() {
      if (!empPageNumbersGroup) return;
      let html = "";
      let pages = [];

      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          pages = [1, 2, 3, "...", totalPages];
        } else if (currentPage >= totalPages - 2) {
          pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
        } else {
          pages = [1, "...", currentPage, "...", totalPages];
        }
      }

      pages.forEach((p) => {
        if (p === "...") {
          html += `<span class="emp-page-ellipsis">…</span>`;
        } else {
          const isActive = p === currentPage ? "active" : "";
          html += `<button type="button" class="emp-page-btn ${isActive}" data-page="${p}">${p}</button>`;
        }
      });

      empPageNumbersGroup.innerHTML = html;

      // Attach listeners to newly rendered page buttons
      empPageNumbersGroup.querySelectorAll(".emp-page-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const pageNum = parseInt(e.currentTarget.getAttribute("data-page"), 10);
          if (pageNum && pageNum !== currentPage) {
            currentPage = pageNum;
            updatePaginationUI();
          }
        });
      });
    }

    // Rows per page change
    if (empPageSizeSelect) {
      empPageSizeSelect.addEventListener("change", (e) => {
        pageSize = parseInt(e.target.value, 10) || 12;
        currentPage = 1;
        updatePaginationUI();
      });
    }

    // Jump form submit
    if (empPageJumpForm) {
      empPageJumpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = parseInt(empJumpInput.value, 10);
        if (target && target >= 1 && target <= totalPages) {
          currentPage = target;
          updatePaginationUI();
        } else {
          empJumpInput.value = currentPage;
        }
      });
    }

    // Navigation button events
    if (empFirstBtn)
      empFirstBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage = 1;
          updatePaginationUI();
        }
      });
    if (empPrevBtn)
      empPrevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          updatePaginationUI();
        }
      });
    if (empNextBtn)
      empNextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          updatePaginationUI();
        }
      });
    if (empLastBtn)
      empLastBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage = totalPages;
          updatePaginationUI();
        }
      });

    // Initial render
    updatePaginationUI();
  })();

  // Card click delegation
  const cardViewContainer = document.getElementById("empCardView");
  if (cardViewContainer) {
    cardViewContainer.addEventListener("click", function (e) {
      if (e.target.closest(".emp-card-checkbox")) return;
      const card = e.target.closest(".emp-card[data-emp-id]");
      if (card) openEmpModal(card.dataset.empId);
    });
  }

  // List row click delegation
  const listTableContainer = document.getElementById("empListTable");
  if (listTableContainer) {
    listTableContainer.addEventListener("click", function (e) {
      if (e.target.closest('input[type="checkbox"]')) return;
      if (e.target.closest("thead")) return;
      const row = e.target.closest("tr");
      if (!row) return;
      const idCell = row.querySelector(".emp-list-id");
      if (idCell) openEmpModal(idCell.textContent.trim());
    });
  }

}

/* 10. Global Interactive Filter Chips System */
function initFilterChipsSystem() {
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".chip-remove-btn");
    if (removeBtn) {
      const chip = removeBtn.closest(".filter-chip");
      if (chip) {
        const chipsBar = chip.parentElement;
        chip.remove();
        updateActiveFilterBadgeCount(chipsBar);
        showToast({
          title: "Filter Removed",
          message: "Filter criteria updated.",
          type: "info",
          duration: 2500,
        });
      }
    }

    const clearAllBtn = e.target.closest(".btn-clear-all-chips");
    if (clearAllBtn) {
      const chipsBar = clearAllBtn.parentElement;
      if (chipsBar) {
        const chips = chipsBar.querySelectorAll(".filter-chip");
        chips.forEach((c) => c.remove());
        updateActiveFilterBadgeCount(chipsBar);
        showToast({
          title: "Filters Cleared",
          message: "All active filter criteria have been reset.",
          type: "info",
          duration: 3000,
        });
      }
    }
  });
}

function updateActiveFilterBadgeCount(chipsBar) {
  if (!chipsBar) return;
  const count = chipsBar.querySelectorAll(".filter-chip").length;
  const container = chipsBar.closest(".container-fluid, body, main") || document;
  const badge = container.querySelector("#activeFilterCountBadge, #empActiveFilterCount");
  if (badge) {
    badge.textContent = count;
    if (count === 0) {
      badge.className = "badge-soft badge-slate ms-1";
    }
  }
}

// Expose globally
window.EMP_DATA = EMP_DATA;
window.openEmpModal = openEmpModal;
window.initEmployeesPage = initEmployeesPage;
