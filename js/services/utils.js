// ─── Pure utility functions (no MVC role) ────────────────────────────────────

/**
 * Returns a sorted array of unique tags across all jobs.
 * @param {Array} jobs
 * @returns {string[]}
 */
export function getUniqueTags(jobs) {
  const uniqueTags = new Set();

  jobs.forEach((job) => {
    (job.tags || []).forEach((tag) => {
      uniqueTags.add(tag);
    });
  });

  return [...uniqueTags].sort();
}

/**
 * Strips HTML markup and returns plain text.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

/**
 * Toggles an item's presence in an array (immutable).
 * @param {Array} array
 * @param {*} id
 * @returns {Array}
 */
export function toggleItem(array, id) {
  if (array.includes(id)) {
    return array.filter((item) => item !== id);
  }

  return [...array, id];
}

/**
 * Filters a list of jobs by a search keyword (matches title + description).
 * @param {Array} jobsToSearch
 * @param {string} searchValue
 * @returns {Array}
 */
export function filterBySearch(jobsToSearch, searchValue) {
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
