// ─── Model Layer: Job Model ───────────────────────────────────────────────────
// Owns all application state and exposes pure data-manipulation methods.
// Has no knowledge of the DOM or how data is displayed.

import { StorageService } from "../model/StorageService.js";
import { toggleItem, getUniqueTags, filterBySearch } from "../services/utils.js";

const _jobModelState = {
  jobs: [],
  tagOptions: [],           // cached once in setJobs(); never recomputed on render
  filters: {
    search: "",
    tags: [],
  },
  savedJobs: StorageService.loadSavedJobs(),
  appliedJobs: StorageService.loadAppliedJobs(),
  currentTab: "all",
};

// ── Private filter helpers ─────────────────────────────────────────────────

function _filterByTags(jobsToFilter, selectedTags = []) {
  if (selectedTags.length === 0) return jobsToFilter;

  return jobsToFilter.filter((job) =>
    selectedTags.every((tag) => (job.tags || []).includes(tag)),
  );
}

function _filterByTab(jobsToFilter, currentTab, savedJobs, appliedJobs) {
  if (currentTab === "saved") {
    return jobsToFilter.filter((job) => savedJobs.includes(job.id));
  }

  if (currentTab === "applied") {
    return jobsToFilter.filter((job) => appliedJobs.includes(job.id));
  }

  return jobsToFilter;
}

// ── Public API ─────────────────────────────────────────────────────────────

export const JobModel = {
  // ── Setters ──────────────────────────────────────────────────────────────

  setJobs(jobs) {
    _jobModelState.jobs = jobs;
    // Cache tag options once — the job list only changes at init
    _jobModelState.tagOptions = getUniqueTags(jobs);
  },

  setSearch(search) {
    _jobModelState.filters.search = search;
  },

  setTagFilters(tags) {
    _jobModelState.filters.tags = tags;
  },

  setCurrentTab(tab) {
    _jobModelState.currentTab = tab;
  },

  toggleSavedJob(jobId) {
    _jobModelState.savedJobs = toggleItem(_jobModelState.savedJobs, jobId);
    StorageService.saveSavedJobs(_jobModelState.savedJobs);
  },

  toggleAppliedJob(jobId) {
    _jobModelState.appliedJobs = toggleItem(_jobModelState.appliedJobs, jobId);
    StorageService.saveAppliedJobs(_jobModelState.appliedJobs);
  },

  // ── Getters ──────────────────────────────────────────────────────────────

  getState() {
    return { ..._jobModelState };
  },

  getTagOptions() {
    return _jobModelState.tagOptions;
  },

  getVisibleJobs() {
    let visibleJobs = [..._jobModelState.jobs];

    visibleJobs = filterBySearch(visibleJobs, _jobModelState.filters.search);
    visibleJobs = _filterByTags(visibleJobs, _jobModelState.filters.tags);
    visibleJobs = _filterByTab(
      visibleJobs,
      _jobModelState.currentTab,
      _jobModelState.savedJobs,
      _jobModelState.appliedJobs,
    );

    return visibleJobs;
  },
};
