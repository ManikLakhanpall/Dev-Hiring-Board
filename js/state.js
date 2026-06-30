const Model = {
  state: {
    jobs: [],
    filters: {
      search: "",
      tags: [],
      remote: "all",
      sort: "date",
    },
    savedJobs: loadSavedJobs(),
    appliedJobs: loadAppliedJobs(),
    currentTab: "all",
  },

  setJobs(jobs) {
    this.state.jobs = jobs;
  },

  setSearch(search) {
    this.state.filters.search = search;
  },

  setTagFilters(tags) {
    this.state.filters.tags = tags;
  },

  setCurrentTab(tab) {
    this.state.currentTab = tab;
  },

  toggleSavedJob(jobId) {
    this.state.savedJobs = toggleItem(this.state.savedJobs, jobId);
    saveSavedJobs(this.state.savedJobs);
  },

  toggleAppliedJob(jobId) {
    this.state.appliedJobs = toggleItem(this.state.appliedJobs, jobId);
    saveAppliedJobs(this.state.appliedJobs);
  },

  getVisibleJobs() {
    let visibleJobs = [...this.state.jobs];

    visibleJobs = filterBySearch(visibleJobs, this.state.filters.search);
    visibleJobs = this.filterByTags(visibleJobs, this.state.filters.tags);
    visibleJobs = this.filterByTab(
      visibleJobs,
      this.state.currentTab,
      this.state.savedJobs,
      this.state.appliedJobs,
    );

    return visibleJobs;
  },

  getTagOptions() {
    return getUniqueTags(this.state.jobs);
  },

  getState() {
    return this.state;
  },

  filterByTags(jobsToFilter, selectedTags = []) {
    if (selectedTags.length === 0) {
      return jobsToFilter;
    }

    return jobsToFilter.filter((job) => {
      return selectedTags.every((tag) => (job.tags || []).includes(tag));
    });
  },

  filterByTab(jobsToFilter, currentTab, savedJobs, appliedJobs) {
    if (currentTab === "saved") {
      return jobsToFilter.filter((job) => savedJobs.includes(job.id));
    }

    if (currentTab === "applied") {
      return jobsToFilter.filter((job) => appliedJobs.includes(job.id));
    }

    return jobsToFilter;
  },
};
