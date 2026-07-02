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
 * Safely removes all children from a DOM element.
 * Preferred over element.innerHTML = ''.
 */
export function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Strips HTML markup and returns plain text.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  // Safe use of innerHTML: detached element used only to extract textContent.
  // Never used to inject into the live DOM.
  const temp = document.createElement("div");
  temp.innerHTML = html || "";
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

/**
 * Returns a debounced version of fn that only fires after `wait` ms of silence.
 * Every new call resets the timer, so rapid calls collapse into one.
 * @param {Function} fn
 * @param {number} wait - milliseconds
 * @returns {Function}
 */
export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
