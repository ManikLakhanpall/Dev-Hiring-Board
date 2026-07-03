// ─── Controller Layer: App Controller ────────────────────────────────────────
// Wires the Model and View layers together.
// Listens for user events → updates the Model → tells the View to re-render.

import { JobService } from "../services/JobService.js";
import { JobModel } from "../model/JobModel.js";
import { JobView } from "../view/JobView.js";
import { FilterView } from "../view/FilterView.js";
import { TabView } from "../view/TabView.js";
import { debounce } from "../services/utils.js";

// ── Loading / Error screen helpers ───────────────────────────────────────

function _hideLoadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;
  // Adding .loaded triggers the CSS opacity/visibility transition
  screen.classList.add("loaded");
}

function _showErrorScreen(onRetry) {
  const loadingScreen = document.getElementById("loading-screen");
  const errorScreen = document.getElementById("error-screen");
  if (loadingScreen) loadingScreen.classList.add("loaded"); // fade out loader
  if (errorScreen) errorScreen.classList.remove("hidden");

  const retryBtn = document.getElementById("error-retry-btn");
  if (retryBtn) {
    retryBtn.onclick = () => {
      errorScreen.classList.add("hidden");
      onRetry();
    };
  }
}

// ── Private helpers ────────────────────────────────────────────────────────

function _setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  const clearButton = document.getElementById("clear-filters");

  const _debouncedSearch = debounce(_handleSearchChange, 300);

  searchInput.addEventListener("input", (e) => {
    _debouncedSearch(e.target.value);
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    JobModel.setSearch("");
    JobModel.setTagFilters([]);
    JobModel.setCurrentTab("all");
    _render();
  });

  // Mobile burger menu for filters (below 1024px breakpoint)
  _setupMobileFilterMenu();
}

function _setupMobileFilterMenu() {
  const toggleBtn = document.getElementById("mobile-filter-toggle");
  const closeBtn = document.getElementById("close-filters");
  const backdrop = document.getElementById("filter-backdrop");
  const panel = document.getElementById("filter-panel");

  if (!toggleBtn || !panel) return;

  function setFiltersOpen(isOpen) {
    document.body.classList.toggle("filters-open", isOpen);
    document.body.classList.toggle("modal-open", isOpen); // lock background scroll
    if (backdrop) backdrop.classList.toggle("hidden", !isOpen);
    // Update aria for the toggle
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  toggleBtn.addEventListener("click", () => {
    const currentlyOpen = document.body.classList.contains("filters-open");
    setFiltersOpen(!currentlyOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => setFiltersOpen(false));
  }
  if (backdrop) {
    backdrop.addEventListener("click", () => setFiltersOpen(false));
  }

  // Auto-close when resizing to desktop (lg+)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && document.body.classList.contains("filters-open")) {
      setFiltersOpen(false);
    }
  });

  // Bonus: close on Escape (nice a11y)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("filters-open")) {
      setFiltersOpen(false);
    }
  });
}

function _handleSearchChange(value) {
  JobModel.setSearch(value);
  _render();
}

function _handleTagChange(selectedTags) {
  JobModel.setTagFilters(selectedTags);
  _render();
}

function _handleTabChange(tab) {
  JobModel.setCurrentTab(tab);
  _render();
}

function _handleSaveJob(jobId) {
  JobModel.toggleSavedJob(jobId);
  _render();
  const s = JobModel.getState();
  JobView.updateModalActionButtons(s.savedJobs, s.appliedJobs);
}

function _handleApplyJob(jobId) {
  JobModel.toggleAppliedJob(jobId);
  _render();
  const s = JobModel.getState();
  JobView.updateModalActionButtons(s.savedJobs, s.appliedJobs);
}

function _handleViewDetails(job) {
  const currentState = JobModel.getState();
  JobView.showJobModal(job, currentState.savedJobs, currentState.appliedJobs, {
    onSave: (id) => {
      _handleSaveJob(id);
      const s = JobModel.getState();
      JobView.updateModalActionButtons(s.savedJobs, s.appliedJobs);
    },
    onApply: (id) => {
      _handleApplyJob(id);
      const s = JobModel.getState();
      JobView.updateModalActionButtons(s.savedJobs, s.appliedJobs);
    },
  });
}

function _render() {
  const currentState = JobModel.getState();
  const visibleJobs = JobModel.getVisibleJobs();

  JobView.renderJobs(visibleJobs, currentState.savedJobs, currentState.appliedJobs, {
    onSave: _handleSaveJob,
    onApply: _handleApplyJob,
    onViewDetails: _handleViewDetails,
  });

  FilterView.renderTagFilters(
    JobModel.getTagOptions(),
    currentState.filters.tags,
    _handleTagChange,
  );

  TabView.updateActiveTab(currentState.currentTab);
}

// ── Public API ─────────────────────────────────────────────────────────────

const AppController = {
  async init() {
    try {
      const jobs = await JobService.fetchJobs();
      JobModel.setJobs(jobs);
      _render();
      _setupEventListeners();
      TabView.setupTabs(_handleTabChange);
      _hideLoadingScreen();
    } catch (error) {
      console.error("Failed to initialize app:", error);
      _showErrorScreen(() => AppController.init());
    }
  },
};

AppController.init();
