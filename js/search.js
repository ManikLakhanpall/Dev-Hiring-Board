function filterBySearch(jobsToSearch, searchValue) {
  const keyword = (searchValue || "").trim().toLowerCase();

  if (!keyword) {
    return jobsToSearch;
  }

  return jobsToSearch.filter((job) => {
    const title = (job.position || "").toLowerCase();
    const description = stripHtml(job.description || "").toLowerCase();

    return title.includes(keyword) || description.includes(keyword);
  });
}
