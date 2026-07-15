// ─── Model Layer: Job Model ───────────────────────────────────────────────────
// Owns all application state and exposes pure data-manipulation methods.
// Has no knowledge of the DOM or how data is displayed.

import { Job, JobModelState } from "../types";
import { StorageService } from "../model/StorageService";
import { toggleItem, getUniqueTags, filterBySearch } from "../services/utils";

const _jobModelState: JobModelState = {
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

function _filterByTags(jobsToFilter: Job[], selectedTags: string[] = []): Job[] {
  if (selectedTags.length === 0) return jobsToFilter;

  return jobsToFilter.filter((job) =>
    selectedTags.every((tag) => (job.tags || []).includes(tag)),
  );
}

function _filterByTab(jobsToFilter: Job[], currentTab: string, savedJobs: (string|number)[], appliedJobs: (string|number)[]): Job[] {
  if (currentTab === "saved") {
    return jobsToFilter.filter((job) => savedJobs.includes(job.id as string));
  }

  if (currentTab === "applied") {
    return jobsToFilter.filter((job) => appliedJobs.includes(job.id as string));
  }

  return jobsToFilter;
}

// ── Public API ─────────────────────────────────────────────────────────────

export const JobModel = {
  // ── Setters ──────────────────────────────────────────────────────────────

  setJobs(jobs: Job[]): void {
    _jobModelState.jobs = jobs;
    // Cache tag options once — the job list only changes at init
    _jobModelState.tagOptions = getUniqueTags(jobs);
  },

  setSearch(search: string): void {
    _jobModelState.filters.search = search;
  },

  setTagFilters(tags: string[]): void {
    _jobModelState.filters.tags = tags;
  },

  setCurrentTab(tab: string): void {
    _jobModelState.currentTab = tab;
  },

  toggleSavedJob(jobId: string | number): void {
    _jobModelState.savedJobs = toggleItem(_jobModelState.savedJobs, String(jobId));
    StorageService.saveSavedJobs(_jobModelState.savedJobs);
  },

  toggleAppliedJob(jobId: string | number): void {
    _jobModelState.appliedJobs = toggleItem(_jobModelState.appliedJobs, String(jobId));
    StorageService.saveAppliedJobs(_jobModelState.appliedJobs);
  },

  // ── Getters ──────────────────────────────────────────────────────────────

  getState(): JobModelState {
    return { ..._jobModelState };
  },

  getTagOptions(): string[] {
    return _jobModelState.tagOptions;
  },

  getVisibleJobs(): Job[] {
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
