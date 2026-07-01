// ─── Controller Layer: App Controller ────────────────────────────────────────
// Wires the Model and View layers together.
// Listens for user events → updates the Model → tells the View to re-render.

import { JobService } from "../services/JobService.js";
import { JobModel } from "../model/JobModel.js";
import { JobView } from "../view/JobView.js";
import { FilterView } from "../view/FilterView.js";
import { TabView } from "../view/TabView.js";

// ── Private helpers ────────────────────────────────────────────────────────

function _setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  const clearButton = document.getElementById("clear-filters");

  searchInput.addEventListener("input", (e) => {
    _handleSearchChange(e.target.value);
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    JobModel.setSearch("");
    JobModel.setTagFilters([]);
    JobModel.setCurrentTab("all");
    _render();
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
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  },
};

AppController.init();
