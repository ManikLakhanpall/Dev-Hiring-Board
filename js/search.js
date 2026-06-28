function searchJobs(jobsToSearch) {
  if (!filters.search.trim()) {
    return jobsToSearch;
  }

  const keyword = filters.search.toLowerCase();

  return jobsToSearch.filter((job) => {
    const title = (job.position || "").toLowerCase();
    const description = stripHtml(job.description || "").toLowerCase();

    return title.includes(keyword) || description.includes(keyword);
  });
}
