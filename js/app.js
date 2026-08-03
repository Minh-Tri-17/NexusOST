/* 
  Nexus ERP + HRM - Core JavaScript Logic
*/

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSidebarActiveState();
  initMobileSidebarToggle();
  initTopbarScrollEffect();
  initTopbarInteractiveControls();

  if (typeof initApexGridDarkModeHandler === "function") {
    initApexGridDarkModeHandler();
  }

  if (document.getElementById("grid") && typeof initCountryGrid === "function") {
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

  // Remove any previously injected close button if present
  const existingCloseBtn = document.querySelector(".sidebar-close-btn");
  if (existingCloseBtn) {
    existingCloseBtn.remove();
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
      if (typeof window.updateNexusGridDarkMode === "function") {
        window.updateNexusGridDarkMode();
      }
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
}

// Expose globally
window.showToast = showToast;
window.initCountryPageModal = initCountryPageModal;
