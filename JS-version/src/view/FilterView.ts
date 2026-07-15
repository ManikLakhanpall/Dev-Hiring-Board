// ─── View Layer: Filter View ──────────────────────────────────────────────────
// Responsible for rendering the tag-filter checkbox list.
// Has no knowledge of application state — it only receives data and callbacks.

import { clearElement } from "../services/utils";

export const FilterView = {
  /**
   * Renders tag filter checkboxes into the #tag-filters container.
   * @param {string[]} tags         - All available tags
   * @param {string[]} selectedTags - Currently active tags
   * @param {Function} onTagChange  - Callback with the new selected tags array
   */
  renderTagFilters(tags: string[], selectedTags: string[] = [], onTagChange?: (tags: string[]) => void): void {
    const container = document.getElementById("tag-filters");
    if (!container) return;
    
    clearElement(container);

    tags.forEach((tag) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.value = tag;
      checkbox.checked = selectedTags.includes(tag);

      checkbox.addEventListener("change", () => {
        const checkedBoxes = document.querySelectorAll<HTMLInputElement>("#tag-filters input:checked");
        const nextTags = Array.from(checkedBoxes).map((box) => box.value);
        onTagChange?.(nextTags);
      });

      label.appendChild(checkbox);
      label.append(` ${tag}`);

      container.appendChild(label);
      container.appendChild(document.createElement("br"));
    });
  },
};
