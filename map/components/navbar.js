(function () {
  "use strict";

//  S T A T E
  let activeTab = null;
  let isOpen = false;
  let isAnimating = false;
  let searchTimeout = null;

//  C O N F I G
  const SCROLL_STEP = 180;
  const SCROLL_DEBOUNCE = 50;
  const SEARCH_DELAY = 300;
  const OPEN_DURATION = 450;
  const SWAP_OUT_DURATION = 120;
  const SWAP_IN_DURATION = 200;
  const CLOSE_DURATION = 400;

//  DOM  C A C H E
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  let track, arrowLeft, arrowRight, overlay, panel;
  let menuItems = [];
  let menuTabs = [];


//  Initialisations
  function init() {
    track     = $(".navbar-track");
    arrowLeft = $(".navbar-arrow[data-dir='left']");
    arrowRight= $(".navbar-arrow[data-dir='right']");
    overlay   = $(".menu-overlay");
    panel     = $(".menu-open");
    menuItems = $$(".menu-item");
    menuTabs  = $$(".menu-tab");

    if (!track || !panel) {
      console.warn("Menu: missing DOM elements");
      return;
    }

    bindArrows();
    bindMenuItems();
    bindOverlay();
    bindKeyboard();
    bindActions();
    bindSearch();
    bindTouch();
    syncStats();

    console.log("✅ Menu initialized (single-container mode)");
  }




//  A R R O W S
  function bindArrows() {
    if (arrowLeft)  arrowLeft.addEventListener("click", () => scrollTrack(-SCROLL_STEP));
    if (arrowRight) arrowRight.addEventListener("click", () => scrollTrack(SCROLL_STEP));

    let timer;
    track.addEventListener("scroll", () => {
      clearTimeout(timer);
      timer = setTimeout(refreshArrows, SCROLL_DEBOUNCE);
    });

    refreshArrows();
    window.addEventListener("resize", refreshArrows);
  }

  function scrollTrack(delta) {
    track.scrollBy({ left: delta, behavior: "smooth" });
  }

  function refreshArrows() {
    if (!arrowLeft || !arrowRight) return;
    const sl = Math.round(track.scrollLeft);
    const max = track.scrollWidth - track.clientWidth;

    arrowLeft.classList.toggle("disabled", sl <= 1);
    arrowLeft.setAttribute("aria-disabled", sl <= 1);

    arrowRight.classList.toggle("disabled", sl >= max - 1);
    arrowRight.setAttribute("aria-disabled", sl >= max - 1);
  }




//  N A V B A R  +  M E M U  Items
  function bindMenuItems() {
    menuItems.forEach(item => {
      item.addEventListener("click", () => {
        const tab = item.dataset.tab;
        if (!tab) return;

        if (activeTab === tab && isOpen) {
          closeMenu();
        } else if (isOpen && activeTab !== tab) {
          swapTab(tab);
        } else {
          openMenu(tab);
        }
      });
    });
  }


//  Open Sleeve 
  function openMenu(tab) {
    if (isAnimating) return;
    isAnimating = true;

    setActiveItem(tab);
    setActiveTab(tab);

    panel.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-active");
    blurMain(true);

    activeTab = tab;
    isOpen = true;

    if (tab === "search") focusSearch();

    setTimeout(() => { isAnimating = false; }, OPEN_DURATION);
  }

//  Sleeve Content  U P D A T E R
  function swapTab(newTab) {
    if (isAnimating) return;
    isAnimating = true;

    //  CLEAR Old Content
    //  from Sleeve
    panel.classList.add("swapping");
    panel.classList.remove("swap-in");

    setTimeout(() => {
      //  Update Tab Indicator
      setActiveItem(newTab);
      setActiveTab(newTab);

      panel.classList.remove("swapping");
      panel.classList.add("swap-in");

      activeTab = newTab;

      if (newTab === "search") focusSearch();

      //  PUSH New Content
      //  to Sleeve
      setTimeout(() => {
        panel.classList.remove("swap-in");
        isAnimating = false;
      }, SWAP_IN_DURATION);
    }, SWAP_OUT_DURATION);
  }

//  Close Sleeve
  function closeMenu() {
    if (isAnimating) return;
    isAnimating = true;

    panel.classList.remove("active", "swapping", "swap-in");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-active");
    blurMain(false);

    clearActiveItems();
    activeTab = null;
    isOpen = false;

    setTimeout(() => { isAnimating = false; }, CLOSE_DURATION);
  }




//////////////////////////  H E L L E R S  /////
////////////////////////////////////////////////
  function setActiveItem(tab) {
    menuItems.forEach(item => {
      const match = item.dataset.tab === tab;
      item.classList.toggle("active", match);
      item.setAttribute("aria-expanded", match ? "true" : "false");
    });
  }

  function clearActiveItems() {
    menuItems.forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-expanded", "false");
    });
  }

  function setActiveTab(tab) {
    menuTabs.forEach(t => {
      t.classList.toggle("active", t.dataset.tab === tab);
    });
  }

  function blurMain(on) {
    const main = document.getElementById("mainArea");
    if (!main) return;
    if (on) {
      main.style.filter = "blur(4px) brightness(0.85)";
      main.style.transition = "filter 350ms cubic-bezier(0.4, 0, 0.2, 1)";
      main.style.pointerEvents = "none";
    } else {
      main.style.filter = "";
      main.style.pointerEvents = "";
    }
  }

  function focusSearch() {
    setTimeout(() => {
      const input = document.getElementById("menuSearchInput");
      if (input) input.focus();
    }, 400);
  }
    function fileIcon(name) {
    const ext = name.split(".").pop().toLowerCase();
    const map = {
      js:"📜", jsx:"⚛️", ts:"📘", tsx:"⚛️", html:"🌐", css:"🎨",
      scss:"🎨", json:"📋", md:"📝", txt:"📄", py:"🐍", java:"☕",
      php:"🐘", rb:"💎", go:"🐹", rs:"🦀", c:"🔧", cpp:"🔧",
      svg:"🎨", png:"🖼️", jpg:"🖼️", gif:"🖼️"
    };
    return map[ext] || "📄";
  }

  function esc(text) {
    const d = document.createElement("div");
    d.textContent = text;
    return d.innerHTML;
  }

  function escRe(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }




  
  function toggleTheme() {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}

    $$(".menu-theme-icon, #themeIcon, #sidebarThemeIcon").forEach(icon => {
      icon.className = next === "dark" ? "fas fa-moon" : "fas fa-sun";
    });

    $$(".menu-theme-label").forEach(lbl => {
      lbl.textContent = next === "dark" ? "Dark Mode" : "Light Mode";
    });
  }





  function syncStats() {
    try {
      const repos = JSON.parse(localStorage.getItem("repositories") || "[]");
      const currentRepo = localStorage.getItem("currentRepository");
      const repoData = currentRepo
        ? JSON.parse(localStorage.getItem(`repo_${currentRepo}`) || "{}")
        : {};
      const files = repoData.files || {};
      const fileCount = Object.keys(files).length;

      let commitCount = 0;
      Object.values(files).forEach(f => {
        commitCount += f.commits ? f.commits.length : 0;
      });

      const storageBytes = new Blob([JSON.stringify(files)]).size;
      const storageKB = Math.round(storageBytes / 1024);

      setText("menuStatFiles", fileCount);
      setText("menuStatCommits", commitCount);
      setText("menuStatStorage", `${storageKB} KB`);
      setText("menuStatBranches", "1");
      setText("menuRepoCount", repos.length);
      setText("menuProfileFiles", fileCount);
    } catch (e) {
      console.warn("Stats sync error:", e);
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }


  function bindTouch() {
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      scrollStart = track.scrollLeft;
    }, { passive: true });

    track.addEventListener("touchmove", e => {
      const dx = startX - e.touches[0].clientX;
      track.scrollLeft = scrollStart + dx;
    }, { passive: true });

    track.addEventListener("touchend", refreshArrows, { passive: true });
  }






//////////////////////////  O V E R L A Y S  /////
//////////////////////////////////////////////////
  function bindOverlay() {
    if (overlay) overlay.addEventListener("click", closeMenu);
  }

  function bindKeyboard() {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }




 
//////////////////////////  A C T I O N S   //////
//////////////////////////////////////////////////
  function bindActions() {
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      handleAction(action);
      closeMenu();
    });
  }

  function handleAction(action) {
    switch (action) {
      case "go-repos":
        navigatePage("repo");
        break;
      case "go-root":
        navigatePage("explorer");
        if (typeof navigateToRoot === "function") navigateToRoot();
        break;
      case "go-code":
        navigatePage("explorer");
        break;
      case "go-branches":
        navigatePage("repo");
        break;
      case "new-file":
        showModal("createFileModal");
        break;
      case "upload":
        if (typeof showUploadModal === "function") showUploadModal();
        break;
      case "import":
        if (typeof showImportModal === "function") showImportModal();
        break;
      case "new-folder":
        if (typeof showCreateFolderModal === "function") showCreateFolderModal();
        break;
      case "toggle-theme":
        toggleTheme();
        break;
      case "help":
        if (typeof showHelp === "function") showHelp();
        break;
      case "settings":
        console.log("Open settings");
        break;
      default:
        console.log("Action:", action);
    }
  }

  function navigatePage(pageName) {
    document.querySelectorAll(".pages").forEach(p => {
      p.classList.remove("show");
      p.classList.add("hide");
    });
    const target = document.querySelector(`[data-page="${pageName}"]`);
    if (target) {
      target.classList.remove("hide");
      target.classList.add("show");
    }
  }

  function showModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  }





  
//////////////////////////  S E A R C H  ////////
/////////////////////////////////////////////////
  function bindSearch() {
    const input = document.getElementById("menuSearchInput");
    const clearBtn = document.getElementById("menuSearchClear");
    if (!input) return;

    input.addEventListener("input", e => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => runSearch(e.target.value), SEARCH_DELAY);
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(searchTimeout);
        runSearch(e.target.value);
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        input.focus();
        runSearch("");
      });
    }
  }

  function runSearch(query) {
    const container = document.getElementById("menuSearchResults");
    if (!container) return;

    if (!query.trim()) {
      container.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🔍</div>
          Start typing to search files...
        </div>`;
      return;
    }

    try {
      const currentRepo = localStorage.getItem("currentRepository");
      if (!currentRepo) {
        container.innerHTML = `
          <div class="search-empty">
            <div class="search-empty-icon">📁</div>
            No repository selected
          </div>`;
        return;
      }

      const repoData = JSON.parse(localStorage.getItem(`repo_${currentRepo}`) || "{}");
      const files = repoData.files || {};
      const results = [];
      const lq = query.toLowerCase();

      Object.keys(files).forEach(path => {
        const file = files[path];
        const lp = path.toLowerCase();
        const pathMatch = lp.includes(lq);
        const contentMatch = file.content && file.content.toLowerCase().includes(lq);

        if (pathMatch || contentMatch) {
          results.push({
            path,
            name: path.split("/").pop(),
            type: pathMatch ? "path" : "content",
            file,
          });
        }
      });

      renderResults(results, query);
    } catch (e) {
      console.error("Search error:", e);
      container.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">⚠️</div>
          Search error occurred
        </div>`;
    }
  }

  function renderResults(results, query) {
    const container = document.getElementById("menuSearchResults");

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon">🤷</div>
          No results found for "<strong>${esc(query)}</strong>"
        </div>`;
      return;
    }

    container.innerHTML = results.map(r => `
      <div class="search-result-item" data-file-path="${esc(r.path)}">
        <div class="search-result-icon">${fileIcon(r.name)}</div>
        <div class="search-result-content">
          <div class="search-result-name">${highlight(esc(r.name), query)}</div>
          <div class="search-result-path">${esc(r.path)}</div>
        </div>
        <span class="search-result-type">${r.type}</span>
      </div>
    `).join("");

    container.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", function () {
        const filePath = this.dataset.filePath;
        openFile(filePath);
        closeMenu();
      });
    });
  }

  function openFile(filePath) {
    navigatePage("file");
    if (typeof loadFileEditor === "function") loadFileEditor(filePath);
    console.log("Opening file:", filePath);
  }

  function highlight(text, query) {
    const re = new RegExp(`(${escRe(query)})`, "gi");
    return text.replace(re, "<mark>$1</mark>");
  }



//  Initialiser
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }


//  Availability
  window.menu = {
    close: closeMenu,
    open: openMenu,
    swap: swapTab,
    syncStats,
    toggleTheme,
  };
})();
/**
 * 
 *  C R E A T E D  B Y
 * 
 *  William Hanson 
 * 
 *  Chevrolay@Outlook.com
 * 
 *  m.me/Chevrolay
 * 
 */
