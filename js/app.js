document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSidebarActiveState();
  initMobileSidebarToggle();
  initTopbarScrollEffect();
  initTopbarInteractiveControls();
  initFilterChipsSystem();

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

  // Country Page & Soft Delete Filter Handler
  initIsDeleteFilter();
  if (document.getElementById("countryFormModal")) {
    initCountryPageModal();
  }

  // Employee Directory Page Logic
  if (document.getElementById("empCardView") || document.getElementById("empDetailModal")) {
    initEmployeesPage();
  }

  // Recruitment Pipeline Page Logic
  if (
    document.getElementById("recruitmentPipelineBoard") ||
    document.getElementById("candidateDetailModal")
  ) {
    initRecruitmentPage();
  }

  // Leave Management Page Logic
  if (
    document.getElementById("leavePlannerTable") ||
    document.getElementById("requestLeaveModal")
  ) {
    initLeaveManagementPage();
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
  if (isCollapsed && window.innerWidth >= 992) {
    document.documentElement.classList.add("sidebar-collapsed");
  } else if (window.innerWidth >= 992) {
    document.documentElement.classList.remove("sidebar-collapsed");
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
        document.documentElement.classList.toggle("sidebar-collapsed");
        const nowCollapsed = document.documentElement.classList.contains("sidebar-collapsed");
        localStorage.setItem("nexus_sidebar_collapsed", nowCollapsed);
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
  initLanguageDropdown();

  const notifBtn = document.getElementById("notifBellBtn");
  if (notifBtn) {
    initNotificationDropdown(notifBtn);
  }
}

function initLanguageDropdown() {
  const savedLang = localStorage.getItem("nexus_lang") || "vi";
  document.documentElement.setAttribute("lang", savedLang);

  const langItems = document.querySelectorAll(".lang-dropdown-menu .dropdown-item[data-lang]");
  if (!langItems.length) return;

  langItems.forEach((item) => {
    const code = item.getAttribute("data-lang");
    if (code === savedLang) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }

    item.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedCode = item.getAttribute("data-lang");

      langItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      localStorage.setItem("nexus_lang", selectedCode);
      document.documentElement.setAttribute("lang", selectedCode);

      const langName = item.querySelector(".lang-name")?.textContent || selectedCode;
      if (typeof showToast === "function") {
        showToast({
          title: "Ngôn ngữ đã thay đổi",
          message: `Hệ thống đã chuyển sang ${langName}`,
          type: "info",
        });
      }
    });
  });
}

/* ==========================================================================
   NexusOST Enterprise Notification Dropdown & Modal Manager
   ========================================================================== */

function initNotificationDropdown(notifBtn) {
  if (!notifBtn) notifBtn = document.getElementById("notifBellBtn");
  if (!notifBtn || notifBtn.dataset.notifDropdownInit === "true") return;
  notifBtn.dataset.notifDropdownInit = "true";

  // Handle Mark All Read in static HTML Dropdown
  const markAllBtn = document.getElementById("dropdownMarkAllReadBtn");
  if (markAllBtn && !markAllBtn.dataset.bound) {
    markAllBtn.dataset.bound = "true";
    markAllBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".notif-dropdown .notif-item").forEach((el) => {
        el.classList.remove("unread");
        const dot = el.querySelector(".unread-dot");
        if (dot) dot.remove();
      });
      const badgeText = document.getElementById("dropdownUnreadBadge");
      if (badgeText) badgeText.innerText = "0 chưa đọc";
      const bellBadge = notifBtn.querySelector(".badge-dot");
      if (bellBadge) bellBadge.style.display = "none";

      if (typeof showToast === "function") {
        showToast({
          title: "Thông báo",
          message: "Đã đánh dấu tất cả thông báo là đã đọc",
          type: "info",
        });
      }
    });
  }

  // Handle click on item in static HTML dropdown
  const itemEls = document.querySelectorAll(".notif-dropdown .notif-item");
  itemEls.forEach((el) => {
    if (!el.dataset.bound) {
      el.dataset.bound = "true";
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        el.classList.remove("unread");
        const dot = el.querySelector(".unread-dot");
        if (dot) dot.remove();
        updateNotifBellBadge(notifBtn);
      });
    }
  });

  // Bind static Modal events if Modal exists
  bindNotifModalEvents();
}

function updateNotifBellBadge(notifBtn) {
  if (!notifBtn) notifBtn = document.getElementById("notifBellBtn");

  const modalEl = document.getElementById("nexusAllNotifModal");
  let unreadCount = 0;
  if (modalEl) {
    unreadCount = modalEl.querySelectorAll(".notif-modal-item.unread").length;
  } else {
    unreadCount = document.querySelectorAll(".notif-dropdown .notif-item.unread").length;
  }

  if (notifBtn) {
    let badge = notifBtn.querySelector(".badge-dot");

    if (unreadCount > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "badge-dot";
        notifBtn.appendChild(badge);
      }
      badge.innerText = unreadCount;
      badge.style.display = "inline-flex";
    } else {
      if (badge) {
        badge.style.display = "none";
      }
    }
  }

  const badgeText = document.getElementById("dropdownUnreadBadge");
  if (badgeText) badgeText.innerText = `${unreadCount} chưa đọc`;

  updateNotifModalCounts();
}

function updateNotifModalCounts() {
  const modalEl = document.getElementById("nexusAllNotifModal");
  if (!modalEl) return;

  const allItems = modalEl.querySelectorAll(".notif-modal-item");
  const unreadItems = modalEl.querySelectorAll(".notif-modal-item.unread");
  const totalCount = allItems.length;
  const unreadCount = unreadItems.length;
  const readCount = totalCount - unreadCount;

  const totalBadge = modalEl.querySelector("#modalTotalNotifBadge");
  if (totalBadge) totalBadge.innerText = totalCount;

  const totalText = modalEl.querySelector("#modalTotalCountText");
  if (totalText) totalText.innerText = totalCount;

  const unreadText = modalEl.querySelector("#modalUnreadCountText");
  if (unreadText) unreadText.innerText = unreadCount;

  const readText = modalEl.querySelector("#modalReadCountText");
  if (readText) readText.innerText = readCount;
}

function ensureNotifModalCreated() {
  // Modal is defined directly in static HTML
  bindNotifModalEvents();
}

function bindNotifModalEvents() {
  const modalEl = document.getElementById("nexusAllNotifModal");
  if (!modalEl) return;

  updateNotifModalCounts();

  if (modalEl.dataset.eventsBound === "true") return;
  modalEl.dataset.eventsBound = "true";

  // Mark all read in static HTML modal
  const markAllBtn = modalEl.querySelector("#modalMarkAllReadBtn");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      modalEl.querySelectorAll(".notif-modal-item").forEach((item) => {
        item.classList.remove("unread");
        const badge = item.querySelector(".badge");
        if (badge) badge.remove();
        const markBtn = item.querySelector(".mark-read-item-btn");
        if (markBtn) markBtn.remove();
      });
      updateNotifBellBadge();
      if (typeof showToast === "function") {
        showToast({ title: "Thông báo", message: "Đã đánh dấu tất cả là đã đọc", type: "info" });
      }
    });
  }

  // Clear read notifications in static HTML modal
  const clearReadBtn = modalEl.querySelector("#modalClearReadBtn");
  if (clearReadBtn) {
    clearReadBtn.addEventListener("click", () => {
      modalEl.querySelectorAll(".notif-modal-item:not(.unread)").forEach((item) => {
        item.remove();
      });
      updateNotifBellBadge();
      if (typeof showToast === "function") {
        showToast({ title: "Thông báo", message: "Đã xóa các thông báo đã đọc", type: "warning" });
      }
    });
  }

  // Item mark read action inside modal
  modalEl.querySelectorAll(".mark-read-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = btn.closest(".notif-modal-item");
      if (item) {
        item.classList.remove("unread");
        const badge = item.querySelector(".badge");
        if (badge) badge.remove();
        btn.remove();
        updateNotifBellBadge();
      }
    });
  });

  // Item delete action inside modal
  modalEl.querySelectorAll(".delete-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = btn.closest(".notif-modal-item");
      if (item) {
        item.remove();
        updateNotifBellBadge();
      }
    });
  });
}

function openNotificationModal() {
  bindNotifModalEvents();
  const modalEl = document.getElementById("nexusAllNotifModal");
  if (modalEl) {
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
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
    container.className = "toast-container-custom";
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
  toastEl.className = `toast-item toast-${toastType}`;
  toastEl.setAttribute("role", "alert");

  toastEl.innerHTML = `
    <div class="toast-accent-bar"></div>
    <div class="toast-icon-box">
      <i class="${toastIcon}"></i>
    </div>
    <div class="toast-content">
      <h6 class="toast-title">${title}</h6>
      ${message ? `<p class="toast-message">${message}</p>` : ""}
    </div>
    <button type="button" class="toast-close" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  const closeBtn = toastEl.querySelector(".toast-close");
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
    if (exportProgressStatusText)
      exportProgressStatusText.textContent = "Generating export file...";
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

/* ======================================================
   10. EMPLOYEE DIRECTORY — DATA & CONTROLLER LOGIC
   ====================================================== */
var EMP_DATA = {
  EMP001: {
    name: "Linh Tran",
    role: "Senior UX Designer",
    id: "#EMP001",
    avatar: "https://i.pravatar.cc/150?img=47",
    initials: null,
    avatarGrad: null,
    dept: "Design",
    deptIcon: "fa-paintbrush",
    deptClass: "badge-amber",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-blue",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Remote",
    statusClass: "badge-purple",
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
    deptClass: "badge-teal",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Maternity Leave",
    statusClass: "badge-cyan",
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
    deptClass: "badge-blue",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-indigo",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-blue",
    contract: "Part-time",
    contractClass: "badge-amber",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-green",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Probation",
    statusClass: "badge-amber",
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
    deptClass: "badge-rose",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-blue",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    skills: [
      "Automation Testing",
      "Cypress",
      "Selenium",
      "JMeter",
      "API Testing",
      "CI Test Integration",
    ],
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
    deptClass: "badge-amber",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-blue",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Remote",
    statusClass: "badge-purple",
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
    deptClass: "badge-amber",
    contract: "Freelance",
    contractClass: "badge-orange",
    status: "Resigned",
    statusClass: "badge-red",
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
    deptClass: "badge-indigo",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-blue",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-purple",
    contract: "Contract",
    contractClass: "badge-purple",
    status: "Remote",
    statusClass: "badge-purple",
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
    deptClass: "badge-teal",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-green",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
    skills: [
      "Corporate Finance",
      "Tax Planning",
      "Accounting Standards",
      "Cashflow",
      "ERP Finance",
    ],
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
    deptClass: "badge-amber",
    contract: "Internship",
    contractClass: "badge-cyan",
    status: "Probation",
    statusClass: "badge-amber",
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
    deptClass: "badge-orange",
    contract: "Part-time",
    contractClass: "badge-amber",
    status: "Active",
    statusClass: "badge-green",
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
    deptClass: "badge-rose",
    contract: "Full-time",
    contractClass: "badge-blue",
    status: "Active",
    statusClass: "badge-green",
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
var STATUS_ICON = {
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
      <span class="badge-soft ${d.deptClass}"><i class="fa-solid ${d.deptIcon}"></i> ${d.dept}</span>
      <span class="badge-soft ${d.contractClass}"><i class="fa-solid fa-file-contract"></i> ${d.contract}</span>
      <span class="badge-soft ${d.statusClass}"><i class="fa-solid ${STATUS_ICON[d.status] || "fa-circle"}"></i> ${d.status}</span>
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
        (sk) => `<span class="app-modal-skill-chip"><i class="fa-solid fa-tag"></i> ${sk}</span>`,
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

  // Card click delegation (Only view icon button opens modal)
  const cardViewContainer = document.getElementById("empCardView");
  if (cardViewContainer) {
    cardViewContainer.addEventListener("click", function (e) {
      const viewBtn = e.target.closest(".emp-card-view-btn");
      if (viewBtn) {
        const card = viewBtn.closest(".emp-card[data-emp-id]");
        if (card) openEmpModal(card.dataset.empId);
      }
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

/* ==========================================================================
   RECRUITMENT PIPELINE PAGE LOGIC
   ========================================================================== */

var RECRUITMENT_DATA = [
  // Applied Column (Stage: applied)
  {
    id: "cand-1",
    name: "Ananya Patel",
    role: "Software Engineer",
    department: "Engineering",
    matchScore: 72,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    stage: "applied",
    starred: true,
    subtext: "Applied 2h ago",
    dateTag: "Applied 2h ago",
    email: "ananya.patel@example.com",
    phone: "+84 912 345 678",
    experience: "4 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,500/mo",
    appliedDate: "May 20, 2024",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    notes: "Strong frontend developer with e-commerce platform experience.",
  },
  {
    id: "cand-2",
    name: "Rahul Verma",
    role: "Frontend Developer",
    department: "Engineering",
    matchScore: 68,
    matchClass: "match-fair",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    stage: "applied",
    starred: false,
    subtext: "Applied 5h ago",
    dateTag: "Applied 5h ago",
    email: "rahul.verma@example.com",
    phone: "+84 903 888 123",
    experience: "3 years",
    location: "Da Nang",
    expectedSalary: "$1,800/mo",
    appliedDate: "May 20, 2024",
    skills: ["Vue.js", "CSS3", "HTML5", "JavaScript"],
    notes: "Good UI design sense and responsive layout skills.",
  },
  {
    id: "cand-3",
    name: "Priya Nair",
    role: "Product Designer",
    department: "Design",
    matchScore: 64,
    matchClass: "match-fair",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    stage: "applied",
    starred: false,
    subtext: "Applied 1d ago",
    dateTag: "Applied 1d ago",
    email: "priya.nair@example.com",
    phone: "+84 987 111 222",
    experience: "5 years",
    location: "Hanoi",
    expectedSalary: "$2,200/mo",
    appliedDate: "May 19, 2024",
    skills: ["Figma", "UI/UX", "User Research", "Prototyping"],
    notes: "Impressive portfolio in mobile UI & design systems.",
  },

  // Screening Column (Stage: screening)
  {
    id: "cand-4",
    name: "James Carter",
    role: "Software Engineer",
    department: "Engineering",
    matchScore: 81,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    stage: "screening",
    starred: false,
    subtext: "Screening | Today, 11:30 AM",
    dateTag: "Today, 11:30 AM",
    email: "james.carter@example.com",
    phone: "+84 944 555 666",
    experience: "6 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$3,200/mo",
    appliedDate: "May 18, 2024",
    skills: ["Java", "Spring Boot", "Microservices", "Docker"],
    notes: "Passed HR phone screening. Technically solid.",
  },
  {
    id: "cand-5",
    name: "Sophia Lee",
    role: "Data Analyst",
    department: "Product",
    matchScore: 76,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    stage: "screening",
    starred: false,
    subtext: "Screening | Today, 02:00 PM",
    dateTag: "Today, 02:00 PM",
    email: "sophia.lee@example.com",
    phone: "+84 918 222 333",
    experience: "4 years",
    location: "Hanoi",
    expectedSalary: "$2,400/mo",
    appliedDate: "May 18, 2024",
    skills: ["Python", "SQL", "Tableau", "PowerBI"],
    notes: "Strong statistical background. Scheduled for tech test.",
  },
  {
    id: "cand-6",
    name: "Arjun Mehta",
    role: "DevOps Engineer",
    department: "Engineering",
    matchScore: 69,
    matchClass: "match-fair",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    stage: "screening",
    starred: false,
    subtext: "Screening | Tomorrow, 10:00 AM",
    dateTag: "Tomorrow, 10:00 AM",
    email: "arjun.mehta@example.com",
    phone: "+84 909 333 444",
    experience: "5 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,800/mo",
    appliedDate: "May 17, 2024",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    notes: "Cloud architecture screening interview set for tomorrow.",
  },

  // Interview Column (Stage: interview)
  {
    id: "cand-7",
    name: "Michael Brown",
    role: "Backend Developer",
    department: "Engineering",
    matchScore: 85,
    matchClass: "match-purple",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 2 | Today, 03:00 PM",
    dateTag: "Round 2 | Today, 03:00 PM",
    email: "michael.brown@example.com",
    phone: "+84 911 222 555",
    experience: "7 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$3,500/mo",
    appliedDate: "May 15, 2024",
    skills: ["Go", "PostgreSQL", "Redis", "gRPC"],
    notes: "Passed Round 1 coding challenge with 98% score.",
  },
  {
    id: "cand-8",
    name: "Emily Johnson",
    role: "UX Designer",
    department: "Design",
    matchScore: 80,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 1 | Today, 04:30 PM",
    dateTag: "Round 1 | Today, 04:30 PM",
    email: "emily.johnson@example.com",
    phone: "+84 933 444 888",
    experience: "5 years",
    location: "Da Nang",
    expectedSalary: "$2,600/mo",
    appliedDate: "May 14, 2024",
    skills: ["Figma", "User Journey", "Wireframing", "Usability Testing"],
    notes: "Design portfolio review round scheduled with Design Lead.",
  },
  {
    id: "cand-9",
    name: "Daniel Kim",
    role: "QA Engineer",
    department: "Engineering",
    matchScore: 74,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 2 | Tomorrow, 09:30 AM",
    dateTag: "Round 2 | Tomorrow, 09:30 AM",
    email: "daniel.kim@example.com",
    phone: "+84 977 888 999",
    experience: "4 years",
    location: "Hanoi",
    expectedSalary: "$2,000/mo",
    appliedDate: "May 13, 2024",
    skills: ["Cypress", "Selenium", "Jest", "API Testing"],
    notes: "Automation testing assessment interview tomorrow morning.",
  },
  {
    id: "cand-18",
    name: "Lucas Scott",
    role: "Frontend Lead",
    department: "Design",
    matchScore: 91,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: true,
    subtext: "Round 3 | Today, 05:00 PM",
    dateTag: "Round 3 | Today, 05:00 PM",
    email: "lucas.scott@example.com",
    phone: "+84 901 111 222",
    experience: "8 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$4,200/mo",
    appliedDate: "May 12, 2024",
    skills: ["React", "Vue.js", "TypeScript", "System Design"],
    notes: "Excellent technical leadership candidate. Finalizing tech interview.",
  },
  {
    id: "cand-19",
    name: "Mia Tanaka",
    role: "Product Designer",
    department: "Design",
    matchScore: 84,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 2 | Tomorrow, 02:00 PM",
    dateTag: "Round 2 | Tomorrow, 02:00 PM",
    email: "mia.tanaka@example.com",
    phone: "+84 902 333 444",
    experience: "5 years",
    location: "Da Nang",
    expectedSalary: "$2,900/mo",
    appliedDate: "May 11, 2024",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    notes: "Great portfolio presentation. Scheduled interview with VP of Product.",
  },
  {
    id: "cand-20",
    name: "Ethan Hunt",
    role: "Cybersecurity Specialist",
    department: "Engineering",
    matchScore: 78,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 1 | Friday, 10:00 AM",
    dateTag: "Round 1 | Friday, 10:00 AM",
    email: "ethan.hunt@example.com",
    phone: "+84 903 555 666",
    experience: "6 years",
    location: "Hanoi",
    expectedSalary: "$3,800/mo",
    appliedDate: "May 10, 2024",
    skills: ["Penetration Testing", "SIEM", "SOC", "Cloud Security"],
    notes: "Strong security audits track record.",
  },
  {
    id: "cand-21",
    name: "Charlotte Dubois",
    role: "Growth Marketer",
    department: "Marketing",
    matchScore: 87,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: true,
    subtext: "Round 2 | Friday, 03:00 PM",
    dateTag: "Round 2 | Friday, 03:00 PM",
    email: "charlotte.dubois@example.com",
    phone: "+84 904 777 888",
    experience: "5 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,700/mo",
    appliedDate: "May 09, 2024",
    skills: ["SEO", "SEM", "Google Analytics", "A/B Testing"],
    notes: "Proven user acquisition strategy results.",
  },
  {
    id: "cand-22",
    name: "Liam O'Connor",
    role: "Solution Architect",
    department: "Engineering",
    matchScore: 92,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    stage: "interview",
    starred: false,
    subtext: "Round 3 | Next Monday",
    dateTag: "Round 3 | Next Monday",
    email: "liam.oconnor@example.com",
    phone: "+84 905 999 000",
    experience: "10 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$5,000/mo",
    appliedDate: "May 08, 2024",
    skills: ["AWS Solution Architect", "Microservices", "Kafka", "Docker"],
    notes: "Exceptional architecture interview performance.",
  },

  // Offer Column (Stage: offer)
  {
    id: "cand-10",
    name: "Olivia Wilson",
    role: "HR Specialist",
    department: "HR Specialist",
    matchScore: 88,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    stage: "offer",
    starred: false,
    subtext: "Offer Sent | May 20, 2024",
    dateTag: "Offer Sent | May 20, 2024",
    email: "olivia.wilson@example.com",
    phone: "+84 966 777 888",
    experience: "6 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,300/mo",
    appliedDate: "May 10, 2024",
    skills: ["Talent Acquisition", "Employee Relations", "Payroll", "HRIS"],
    notes: "Formal job offer letter sent. Awaiting signed acceptance.",
  },
  {
    id: "cand-11",
    name: "William Davis",
    role: "Sales Manager",
    department: "Sales",
    matchScore: 82,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    stage: "offer",
    starred: false,
    subtext: "Offer Sent | May 19, 2024",
    dateTag: "Offer Sent | May 19, 2024",
    email: "william.davis@example.com",
    phone: "+84 922 333 444",
    experience: "8 years",
    location: "Hanoi",
    expectedSalary: "$3,800/mo",
    appliedDate: "May 08, 2024",
    skills: ["B2B Sales", "Key Account Management", "CRM", "Negotiation"],
    notes: "Offer package under review. Candidate requested stock options.",
  },
  {
    id: "cand-12",
    name: "Neha Sharma",
    role: "Marketing Manager",
    department: "Marketing",
    matchScore: 78,
    matchClass: "match-medium",
    avatar:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    stage: "offer",
    starred: false,
    subtext: "Negotiation | May 18, 2024",
    dateTag: "Negotiation | May 18, 2024",
    email: "neha.sharma@example.com",
    phone: "+84 955 666 777",
    experience: "5 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,700/mo",
    appliedDate: "May 07, 2024",
    skills: ["Digital Marketing", "SEO/SEM", "Content Strategy", "Brand"],
    notes: "Salary negotiation phase. Final decision expected by Friday.",
  },

  // Hired Column (Stage: hired)
  {
    id: "cand-13",
    name: "Ethan Thompson",
    role: "Software Engineer",
    department: "Engineering",
    matchScore: 91,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    stage: "hired",
    starred: false,
    subtext: "Joined | May 16, 2024",
    dateTag: "Joined | May 16, 2024",
    email: "ethan.thompson@example.com",
    phone: "+84 938 111 999",
    experience: "7 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$3,400/mo",
    appliedDate: "May 01, 2024",
    skills: ["Fullstack", "React", "Node.js", "PostgreSQL", "AWS"],
    notes: "Onboarded successfully! Assigned to Core Platform Team.",
  },
  {
    id: "cand-14",
    name: "Isabella Martinez",
    role: "HR Specialist",
    department: "HR Specialist",
    matchScore: 89,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    stage: "hired",
    starred: false,
    subtext: "Joined | May 15, 2024",
    dateTag: "Joined | May 15, 2024",
    email: "isabella.martinez@example.com",
    phone: "+84 947 222 111",
    experience: "6 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,200/mo",
    appliedDate: "Apr 28, 2024",
    skills: ["HR Operations", "Onboarding", "Labor Law", "Training"],
    notes: "Completed orientation and documentation.",
  },
  {
    id: "cand-15",
    name: "Alexander Garcia",
    role: "Sales Manager",
    department: "Sales",
    matchScore: 86,
    matchClass: "match-high",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    stage: "hired",
    starred: false,
    subtext: "Joined | May 14, 2024",
    dateTag: "Joined | May 14, 2024",
    email: "alexander.garcia@example.com",
    phone: "+84 988 777 666",
    experience: "9 years",
    location: "Hanoi",
    expectedSalary: "$4,000/mo",
    appliedDate: "Apr 25, 2024",
    skills: ["Enterprise Sales", "Team Leadership", "Strategic Partnerships"],
    notes: "Leading APAC Sales Expansion Initiative.",
  },

  // Rejected Column (Stage: rejected)
  {
    id: "cand-16",
    name: "Marcus Vance",
    role: "Backend Developer",
    department: "Engineering",
    matchScore: 54,
    matchClass: "match-fair",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    stage: "rejected",
    starred: false,
    subtext: "Rejected | Tech Test",
    dateTag: "Rejected | Tech Test",
    email: "marcus.vance@example.com",
    phone: "+84 911 000 111",
    experience: "2 years",
    location: "Ho Chi Minh City",
    expectedSalary: "$2,000/mo",
    appliedDate: "Apr 20, 2024",
    skills: ["PHP", "Laravel", "MySQL"],
    notes: "Did not meet technical benchmark for senior backend position.",
  },
  {
    id: "cand-17",
    name: "Chloe Bennett",
    role: "Marketing Manager",
    department: "Marketing",
    matchScore: 61,
    matchClass: "match-fair",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    stage: "rejected",
    starred: false,
    subtext: "Rejected | Salary Expectation",
    dateTag: "Rejected | Salary Expectation",
    email: "chloe.bennett@example.com",
    phone: "+84 944 888 222",
    experience: "4 years",
    location: "Hanoi",
    expectedSalary: "$4,500/mo",
    appliedDate: "Apr 18, 2024",
    skills: ["Copywriting", "Social Media", "SEO"],
    notes: "Salary expectation out of approved budget range.",
  },
];

var activeCandidateIdForModal = null;

function initRecruitmentPage() {
  renderPipelineBoard();
  initRecruitmentDragAndDrop();
  initRecruitmentFilters();
  initViewToggle();
}

function initViewToggle() {
  const kanbanBtn = document.getElementById("kanbanViewBtn");
  const listBtn = document.getElementById("listViewBtn");
  const kanbanBoard = document.getElementById("recruitmentPipelineBoard");
  const listView = document.getElementById("recruitmentListView");

  if (kanbanBtn && listBtn && kanbanBoard && listView) {
    kanbanBtn.addEventListener("click", () => {
      kanbanBtn.classList.add("active");
      listBtn.classList.remove("active");
      kanbanBoard.classList.remove("d-none");
      listView.classList.add("d-none");
    });

    listBtn.addEventListener("click", () => {
      listBtn.classList.add("active");
      kanbanBtn.classList.remove("active");
      listView.classList.remove("d-none");
      kanbanBoard.classList.add("d-none");
    });
  }
}

var activeStageForModal = "";

function openStageCandidatesModal(stage) {
  const modalEl = document.getElementById("stageCandidatesModal");
  if (!modalEl) return;

  activeStageForModal = stage;
  const list = RECRUITMENT_DATA.filter((c) => c.stage === stage);

  const stageTitles = {
    applied: "Applied Candidates",
    screening: "Screening Candidates",
    interview: "Interview Candidates",
    offer: "Offer Candidates",
    hired: "Hired Candidates",
    rejected: "Rejected Candidates",
  };

  const stageBaselineCounts = {
    applied: 126,
    screening: 84,
    interview: 52,
    offer: 28,
    hired: 16,
    rejected: 42,
  };

  const totalCount = stageBaselineCounts[stage] || list.length;

  const titleEl = document.getElementById("stageModalTitle");
  if (titleEl) titleEl.textContent = stageTitles[stage] || `${stage.toUpperCase()} Candidates`;

  const countBadge = document.getElementById("stageModalCountBadge");
  if (countBadge) countBadge.textContent = `${totalCount} Candidates`;

  const searchInput = document.getElementById("stageModalSearchInput");
  if (searchInput) searchInput.value = "";

  const clearBtn = document.getElementById("stageModalClearSearchBtn");
  if (clearBtn) clearBtn.classList.add("d-none");

  renderStageModalList(list);

  if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    if (bsModal) bsModal.show();
  } else {
    modalEl.classList.add("show");
    modalEl.style.display = "block";
  }
}

function renderStageModalList(list) {
  const container = document.getElementById("stageModalCandidateList");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4 text-muted">
        <i class="fa-solid fa-folder-open fs-3 mb-2"></i>
        <div>No candidate records in this stage</div>
      </div>
    `;
    return;
  }

  container.innerHTML = list
    .map(
      (c) => `
    <div class="d-flex align-items-center justify-content-between rounded-4 border bg-surface stage-modal-item-card">
      <div class="d-flex align-items-center gap-3.5">
        <img src="${c.avatar}" class="rounded-circle shadow-xs" style="width: 48px; height: 48px; object-fit: cover;" alt="${c.name}" />
        <div>
          <div class="d-flex align-items-center gap-2 mb-1">
            <h6 class="fw-bold text-main mb-0 fs-6 cursor-pointer text-hover-primary" onclick="openCandidateDetailFromStageModal('${c.id}')">${c.name}</h6>
            <span class="badge-soft badge-blue">${c.department}</span>
          </div>
          <div class="text-muted small d-flex align-items-center gap-2">
            <span><i class="fa-solid fa-briefcase me-1 text-muted"></i>${c.role}</span>
            <span>•</span>
            <span class="match-score-pill ${c.matchClass}"><i class="fa-solid fa-sparkles"></i> ${c.matchScore}% Match</span>
          </div>
        </div>
      </div>
      <button class="btn btn-sm btn-pastel-primary rounded-pill px-4 py-2 font-semibold text-xs d-inline-flex align-items-center gap-1.5" onclick="openCandidateDetailFromStageModal('${c.id}')">
        <span class="mx-1">View Profile</span> <i class="fa-solid fa-arrow-right text-2xs"></i>
      </button>
    </div>
  `,
    )
    .join("");
}

function openCandidateDetailFromStageModal(id) {
  const stageModalEl = document.getElementById("stageCandidatesModal");
  if (stageModalEl) {
    const bsModal = bootstrap.Modal.getInstance(stageModalEl);
    if (bsModal) bsModal.hide();
  }
  openCandidateDetailModal(id);
}

function clearStageModalSearch() {
  const searchInput = document.getElementById("stageModalSearchInput");
  if (searchInput) {
    searchInput.value = "";
    filterStageCandidatesModal("");
  }
}

function filterStageCandidatesModal(query) {
  const q = (query || "").toLowerCase().trim();
  const clearBtn = document.getElementById("stageModalClearSearchBtn");
  if (clearBtn) {
    if (q.length > 0) clearBtn.classList.remove("d-none");
    else clearBtn.classList.add("d-none");
  }

  const list = RECRUITMENT_DATA.filter((c) => c.stage === activeStageForModal);
  const filtered = list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q),
  );
  renderStageModalList(filtered);
}

function renderPipelineBoard() {
  const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"];

  // Filter variables
  const searchVal = (document.getElementById("recruitmentSearchInput")?.value || "")
    .toLowerCase()
    .trim();
  const deptVal = document.getElementById("filterDepartment")?.value || "all";
  const roleVal = document.getElementById("filterRole")?.value || "all";
  const stageVal = document.getElementById("filterStage")?.value || "all";
  const matchVal = document.getElementById("filterMatchLevel")?.value || "all";

  // Total counts tracking
  const stageCounts = { applied: 0, screening: 0, interview: 0, offer: 0, hired: 0, rejected: 0 };
  const stageTotalBaseline = {
    applied: 126,
    screening: 84,
    interview: 52,
    offer: 28,
    hired: 16,
    rejected: 42,
  };

  stages.forEach((stage) => {
    const listContainer = document.getElementById(`col-${stage}-list`);
    if (!listContainer) return;

    let filtered = RECRUITMENT_DATA.filter((c) => c.stage === stage);

    // Apply Department filter
    if (deptVal !== "all") {
      filtered = filtered.filter((c) => c.department === deptVal);
    }
    // Apply Role filter
    if (roleVal !== "all") {
      filtered = filtered.filter((c) => c.role === roleVal);
    }
    // Apply Stage filter
    if (stageVal !== "all" && stageVal !== stage) {
      filtered = [];
    }
    // Apply Match score filter
    if (matchVal === "high") filtered = filtered.filter((c) => c.matchScore >= 80);
    if (matchVal === "medium")
      filtered = filtered.filter((c) => c.matchScore >= 70 && c.matchScore < 80);
    if (matchVal === "fair") filtered = filtered.filter((c) => c.matchScore < 70);

    // Apply Search Filter
    if (searchVal) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchVal) ||
          c.role.toLowerCase().includes(searchVal) ||
          c.department.toLowerCase().includes(searchVal),
      );
    }

    stageCounts[stage] = filtered.length;

    // Display Top 3 cards in Kanban Column
    const initialLimit = 3;
    const cardsToDisplay = filtered.slice(0, initialLimit);

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-column-placeholder">
          <i class="fa-solid fa-inbox fs-3 mb-2 text-muted"></i>
          <div>No candidates in this stage</div>
        </div>
      `;
    } else {
      listContainer.innerHTML = cardsToDisplay.map((c) => createCandidateCardHTML(c)).join("");
    }

    // Update Stage Count Badge
    const countBadge = document.getElementById(`count-${stage}`);
    if (countBadge) {
      countBadge.textContent = stageCounts[stage];
    }

    // Update "+ X more candidates" button text
    const moreBtnText = document.getElementById(`more-${stage}-text`);
    if (moreBtnText) {
      const baselineTotal = stageTotalBaseline[stage] || 0;
      const extraCount = Math.max(
        0,
        baselineTotal - initialLimit + (stageCounts[stage] - initialLimit),
      );
      moreBtnText.textContent = `+ ${extraCount} more candidates`;
    }
  });

  // Update Metric Header Stats
  const totalAppliedEl = document.getElementById("statTotalApplied");
  if (totalAppliedEl) totalAppliedEl.textContent = stageCounts.applied + 123;
  const inScreeningEl = document.getElementById("statInScreening");
  if (inScreeningEl) inScreeningEl.textContent = stageCounts.screening + 81;
  const interviewingEl = document.getElementById("statInterviewing");
  if (interviewingEl) interviewingEl.textContent = stageCounts.interview + 49;
  const offersSentEl = document.getElementById("statOffersSent");
  if (offersSentEl) offersSentEl.textContent = stageCounts.offer + 25;
  const totalHiredEl = document.getElementById("statTotalHired");
  if (totalHiredEl) totalHiredEl.textContent = stageCounts.hired + 13;

  // Re-attach card events
  attachCardEvents();

  // Render Table View
  renderCandidateTable();
}

function renderCandidateTable() {
  const tbody = document.getElementById("recruitmentTableBody");
  if (!tbody) return;

  const searchVal = (document.getElementById("recruitmentSearchInput")?.value || "")
    .toLowerCase()
    .trim();
  const deptVal = (document.getElementById("filterDepartment")?.value || "all").toLowerCase();
  const roleVal = (document.getElementById("filterRole")?.value || "all").toLowerCase();
  const stageVal = (document.getElementById("filterStage")?.value || "all").toLowerCase();

  const rows = tbody.querySelectorAll("tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const matchSearch = !searchVal || text.includes(searchVal);
    const matchDept = deptVal === "all" || text.includes(deptVal);
    const matchRole = roleVal === "all" || text.includes(roleVal);
    const matchStage = stageVal === "all" || text.includes(stageVal);

    row.style.display = matchSearch && matchDept && matchRole && matchStage ? "" : "none";
  });
}

function createCandidateCardHTML(c) {
  const isStarredClass = c.starred ? "starred" : "";
  const starIconClass = c.starred ? "fa-solid fa-star" : "fa-regular fa-star";

  // Tag styling based on stage
  const tagClassMap = {
    applied: "tag-applied",
    screening: "tag-screening",
    interview: "tag-interview",
    offer: "tag-offer",
    hired: "tag-hired",
    rejected: "tag-rejected",
  };

  return `
    <div class="candidate-card" draggable="true" data-id="${c.id}" data-stage="${c.stage}">
      <div class="candidate-card-header d-flex align-items-center justify-content-between mb-2">
        <input type="checkbox" class="form-check-input m-0" value="${c.id}" onclick="event.stopPropagation()" aria-label="Select ${c.name}" />
        <div class="d-flex align-items-center gap-1 ms-auto">
          <button class="btn-star-candidate ${isStarredClass}" title="Star candidate" onclick="toggleStarCandidate(event, '${c.id}')">
            <i class="${starIconClass}"></i>
          </button>
          <button class="card-action-btn" title="View Profile" onclick="openCandidateDetailModal('${c.id}')">
            <i class="fa-regular fa-eye text-primary"></i>
          </button>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2.5 mb-2">
        <img src="${c.avatar}" alt="${c.name}" class="candidate-avatar" />
        <div>
          <h4 class="candidate-name" onclick="openCandidateDetailModal('${c.id}')">${c.name}</h4>
          <div class="candidate-role">${c.role}</div>
          <div class="match-score-pill ${c.matchClass}">
            <i class="fa-solid fa-sparkles"></i>
            <span>${c.matchScore}% Match</span>
          </div>
        </div>
      </div>
      <div class="candidate-card-footer">
        <span class="status-tag ${tagClassMap[c.stage]}">
          <i class="fa-regular fa-clock"></i>
          <span>${c.subtext}</span>
        </span>
      </div>
    </div>
  `;
}

function attachCardEvents() {
  const cards = document.querySelectorAll(".candidate-card");
  cards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
  });
}

// Drag & Drop Implementation
var draggedCandidateId = null;

function handleDragStart(e) {
  draggedCandidateId = this.getAttribute("data-id");
  this.classList.add("dragging");
  e.dataTransfer.setData("text/plain", draggedCandidateId);
  e.dataTransfer.effectAllowed = "move";
}

function handleDragEnd() {
  this.classList.remove("dragging");
  const columns = document.querySelectorAll(".pipeline-column");
  columns.forEach((col) => col.classList.remove("drag-over"));
}

function initRecruitmentDragAndDrop() {
  const columns = document.querySelectorAll(".pipeline-column");
  columns.forEach((col) => {
    col.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      col.classList.add("drag-over");
    });

    col.addEventListener("dragleave", () => {
      col.classList.remove("drag-over");
    });

    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drag-over");
      const targetStage = col.getAttribute("data-stage");
      const candidateId = e.dataTransfer.getData("text/plain") || draggedCandidateId;

      if (candidateId && targetStage) {
        moveCandidateToStage(candidateId, targetStage);
      }
    });
  });
}

function moveCandidateToStage(id, newStage) {
  const candidate = RECRUITMENT_DATA.find((c) => c.id === id);
  if (!candidate) return;

  if (candidate.stage === newStage) return;

  const oldStage = candidate.stage;
  candidate.stage = newStage;

  // Update subtext / dateTag according to new stage
  const stageLabels = {
    applied: `Applied just now`,
    screening: `Screening | Today`,
    interview: `Interview | Scheduled`,
    offer: `Offer Sent | Today`,
    hired: `Joined | Today`,
    rejected: `Not selected`,
  };
  candidate.subtext = stageLabels[newStage];

  renderPipelineBoard();

  showToast({
    title: "Candidate Stage Updated",
    message: `${candidate.name} moved from ${oldStage.toUpperCase()} to ${newStage.toUpperCase()}`,
    type: "success",
    duration: 3000,
  });
}

function toggleStarCandidate(e, id) {
  e.stopPropagation();
  const candidate = RECRUITMENT_DATA.find((c) => c.id === id);
  if (candidate) {
    candidate.starred = !candidate.starred;
    renderPipelineBoard();
    showToast({
      title: candidate.starred ? "Candidate Bookmarked" : "Bookmark Removed",
      message: `${candidate.name} is ${candidate.starred ? "now starred" : "unstarred"}.`,
      type: "info",
      duration: 2000,
    });
  }
}

function initRecruitmentFilters() {
  const searchInput = document.getElementById("recruitmentSearchInput");
  const clearBtn = document.getElementById("clearRecruitmentSearchBtn");
  const deptSelect = document.getElementById("filterDepartment");
  const roleSelect = document.getElementById("filterRole");
  const stageSelect = document.getElementById("filterStage");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (clearBtn) {
        if (searchInput.value.trim() !== "") {
          clearBtn.classList.remove("d-none");
        } else {
          clearBtn.classList.add("d-none");
        }
      }
      renderPipelineBoard();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      clearBtn.classList.add("d-none");
      renderPipelineBoard();
    });
  }

  [deptSelect, roleSelect, stageSelect].forEach((select) => {
    if (select) select.addEventListener("change", renderPipelineBoard);
  });
}

function openCandidateDetailModal(id) {
  activeCandidateIdForModal = id;
  const c = RECRUITMENT_DATA.find((item) => item.id === id);
  if (!c) return;

  const modalEl = document.getElementById("candidateDetailModal");
  if (!modalEl) return;

  // Eyebrow tag title (View-only profile)
  const eyebrowTag = modalEl.querySelector(".app-modal-eyebrow-tag span");
  if (eyebrowTag) {
    eyebrowTag.textContent = "CANDIDATE RECRUITMENT PROFILE (VIEW ONLY)";
  }

  document.getElementById("detailAvatar").src = c.avatar;
  document.getElementById("detailName").textContent = c.name;
  document.getElementById("detailRole").textContent = c.role;
  document.getElementById("detailDept").textContent = c.department;
  document.getElementById("detailLocation").textContent = c.location || "Ho Chi Minh City";
  document.getElementById("detailEmail").textContent =
    c.email || `${c.name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
  document.getElementById("detailPhone").textContent = c.phone || "+84 912 345 678";
  document.getElementById("detailSalary").textContent = c.expectedSalary || "$2,500 / month";
  document.getElementById("detailAppliedDate").textContent = c.appliedDate || "May 20, 2024";
  document.getElementById("detailNotes").textContent =
    c.notes || "High recommendation from technical interviewer.";

  const statMatch = document.getElementById("detailStatMatch");
  if (statMatch) statMatch.textContent = `${c.matchScore}%`;

  const statExp = document.getElementById("detailStatExp");
  if (statExp) statExp.textContent = c.experience || "4 Yrs";

  const statSkills = document.getElementById("detailStatSkills");
  if (statSkills) statSkills.textContent = (c.skills || []).length || 5;

  const matchBadge = document.getElementById("detailMatchBadge");
  if (matchBadge) {
    matchBadge.className = `match-score-pill ${c.matchClass}`;
    matchBadge.innerHTML = `<i class="fa-solid fa-sparkles"></i> <span>${c.matchScore}% Match</span>`;
  }

  const stageBadge = document.getElementById("detailStageBadge");
  if (stageBadge) {
    stageBadge.className = `badge-soft badge-green`;
    stageBadge.innerHTML = `<i class="fa-solid fa-circle"></i> ${c.stage.toUpperCase()}`;
  }

  // Render skills chips
  const skillsContainer = document.getElementById("detailSkillsContainer");
  if (skillsContainer) {
    skillsContainer.innerHTML = (c.skills || ["JavaScript", "Problem Solving", "Teamwork"])
      .map(
        (s) =>
          `<span class="app-modal-skill-chip"><i class="fa-solid fa-check text-primary"></i> ${s}</span>`,
      )
      .join("");
  }

  // Ensure View-Only Mode
  const stageControlBox = document.getElementById("modalStageControlBox");
  const closeBtn = document.getElementById("modalCloseBtn");
  const rejectBtn = document.getElementById("modalRejectBtn");
  const saveBtn = document.getElementById("modalSaveBtn");

  if (stageControlBox) stageControlBox.classList.add("d-none");
  if (rejectBtn) rejectBtn.classList.add("d-none");
  if (saveBtn) saveBtn.classList.add("d-none");
  if (closeBtn) closeBtn.innerHTML = `<i class="fa-solid fa-xmark me-1"></i> Close`;

  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Expose globally
window.RECRUITMENT_DATA = RECRUITMENT_DATA;
window.initRecruitmentPage = initRecruitmentPage;
window.openCandidateDetailModal = openCandidateDetailModal;
window.toggleStarCandidate = toggleStarCandidate;
window.moveCandidateToStage = moveCandidateToStage;
window.openStageCandidatesModal = openStageCandidatesModal;
window.filterStageCandidatesModal = filterStageCandidatesModal;
window.clearStageModalSearch = clearStageModalSearch;
window.openCandidateDetailFromStageModal = openCandidateDetailFromStageModal;

/* ==========================================================================
   LEAVE MANAGEMENT & PLANNER PAGE LOGIC
   ========================================================================== */

function initLeaveManagementPage() {
  // Render Chart
  if (typeof window.renderLeaveDistributionChart === "function") {
    window.renderLeaveDistributionChart();
  }

  // 0. View Mode Toggle (Schedule vs List)
  const scheduleViewBtn =
    document.getElementById("scheduleViewBtn") || document.getElementById("calendarViewBtn");
  const listViewBtn =
    document.getElementById("listViewBtn") || document.getElementById("tableViewBtn");
  const leaveScheduleView =
    document.getElementById("leaveScheduleView") || document.getElementById("leaveCalendarView");
  const leaveListView =
    document.getElementById("leaveListView") || document.getElementById("leaveTableView");

  if (scheduleViewBtn && listViewBtn && leaveScheduleView && leaveListView) {
    scheduleViewBtn.addEventListener("click", () => {
      scheduleViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
      leaveScheduleView.classList.remove("d-none");
      leaveScheduleView.style.display = "block";
      leaveListView.classList.add("d-none");
      leaveListView.style.display = "none";
    });

    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("active");
      scheduleViewBtn.classList.remove("active");
      leaveScheduleView.classList.add("d-none");
      leaveScheduleView.style.display = "none";
      leaveListView.classList.remove("d-none");
      leaveListView.style.display = "block";
    });
  }
}

window.initLeaveManagementPage = initLeaveManagementPage;

/* ==========================================================================
   ISDELETE (SOFT DELETE) FILTER SYSTEM
   ========================================================================== */
function initIsDeleteFilter() {
  const chkIsDelete = document.getElementById("chkIsDelete");
  const matrixChkIsDelete = document.getElementById("matrixChkIsDelete");
  const chipIsDelete = document.getElementById("chipIsDelete");
  const removeChipIsDelete = document.getElementById("removeChipIsDelete");

  if (!chkIsDelete && !matrixChkIsDelete) return;

  const handleIsDeleteToggle = (isValChecked) => {
    // Sync both toolbar and matrix checkboxes
    if (chkIsDelete) chkIsDelete.checked = isValChecked;
    if (matrixChkIsDelete) matrixChkIsDelete.checked = isValChecked;

    // Toggle chip visibility
    if (chipIsDelete) {
      if (isValChecked) {
        chipIsDelete.classList.remove("d-none");
        chipIsDelete.classList.add("d-inline-flex");
      } else {
        chipIsDelete.classList.add("d-none");
        chipIsDelete.classList.remove("d-inline-flex");
      }
    }

    // Toggle deleted rows in data grid
    const deletedRows = document.querySelectorAll(".deleted-row");
    deletedRows.forEach((row) => {
      if (isValChecked) {
        row.classList.remove("d-none");
      } else {
        row.classList.add("d-none");
      }
    });

    if (typeof showToast === "function") {
      showToast({
        title: isValChecked ? "Show Deleted Active" : "Show Deleted Inactive",
        message: isValChecked
          ? "Displaying grid dataset including soft-deleted records (IsDelete = True)"
          : "Hiding soft-deleted records from data grid",
        type: isValChecked ? "warning" : "info",
      });
    }
  };

  if (chkIsDelete) {
    chkIsDelete.addEventListener("change", (e) => handleIsDeleteToggle(e.target.checked));
  }
  if (matrixChkIsDelete) {
    matrixChkIsDelete.addEventListener("change", (e) => handleIsDeleteToggle(e.target.checked));
  }
  if (removeChipIsDelete) {
    removeChipIsDelete.addEventListener("click", () => handleIsDeleteToggle(false));
  }
}

window.initIsDeleteFilter = initIsDeleteFilter;

