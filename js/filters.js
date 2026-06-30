function renderTagFilters(tags, selectedTags = [], onTagChange) {
  const container = document.getElementById("tag-filters");
  container.innerHTML = "";

  tags.forEach((tag) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.value = tag;
    checkbox.checked = selectedTags.includes(tag);

    checkbox.addEventListener("change", () => {
      const checkedBoxes = document.querySelectorAll(
        "#tag-filters input:checked",
      );

      const nextTags = [...checkedBoxes].map((box) => box.value);
      onTagChange?.(nextTags);
    });

    label.appendChild(checkbox);
    label.append(` ${tag}`);

    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

window.View = window.View || {};
const View = window.View;
View.renderTagFilters = renderTagFilters;

