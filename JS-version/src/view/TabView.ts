// ─── View Layer: Tab View ─────────────────────────────────────────────────────
// Responsible for tab button event wiring and active-tab visual state.
// Has no knowledge of application state — it only receives data and callbacks.

export const TabView = {
  /**
   * Attaches click listeners to all #tabs buttons.
   * @param {Function} onTabChange - Callback with the selected tab string
   */
  setupTabs(onTabChange: (tab: string) => void): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>("#tabs button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.tab) {
          onTabChange(button.dataset.tab);
        }
      });
    });
  },

  /**
   * Highlights the currently active tab button.
   * @param {string} currentTab - The active tab identifier
   */
  updateActiveTab(currentTab: string): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>("#tabs button");

    buttons.forEach((button) => {
      button.classList.toggle("active-tab", button.dataset.tab === currentTab);
    });
  },
};
