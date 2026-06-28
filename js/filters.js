function renderTagFilters() {
  const container = document.getElementById("tag-filters");
  container.innerHTML = "";

  const tags = getUniqueTags(jobs);

  tags.forEach((tag) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.value = tag;

    checkbox.addEventListener("change", () => {
      const checkedBoxes = document.querySelectorAll(
        "#tag-filters input:checked",
      );

      filters.tags = [...checkedBoxes].map((box) => box.value);

      updateJobs();
    });

    label.appendChild(checkbox);
    label.append(` ${tag}`);

    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

function filterJobs(jobsToFilter) {
  if (filters.tags.length === 0) {
    return jobsToFilter;
  }

  return jobsToFilter.filter((job) => {
    return filters.tags.every((tag) => job.tags.includes(tag));
  });
}
