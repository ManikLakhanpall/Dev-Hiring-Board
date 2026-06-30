function setupTabs(onTabChange) {
  const buttons = document.querySelectorAll("#tabs button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      onTabChange?.(button.dataset.tab);
    });
  });
}

function updateActiveTab(currentTab) {
  const buttons = document.querySelectorAll("#tabs button");

  buttons.forEach((button) => {
    button.classList.toggle("active-tab", button.dataset.tab === currentTab);
  });
}

window.View = window.View || {};
const View = window.View;
View.setupTabs = setupTabs;
View.updateActiveTab = updateActiveTab;

