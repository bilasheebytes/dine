window.addEventListener("DOMContentLoaded", () => {
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll(':scope > [role="tab"]');

  tabs.forEach((tab) => {
    tab.addEventListener("click", changeTabs);
  });

  let tabFocus = 0;

  tabList.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      tabs[tabFocus].setAttribute("tabindex", -1);
      if (e.key === "ArrowRight") {
        tabFocus++;
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
      } else if (e.key === "ArrowLeft") {
        tabFocus--;
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute("tabindex", 0);
      tabs[tabFocus].focus();
    }
  });
});

function changeTabs(e) {
  const targetTab = e.target;
  const tabList = targetTab.parentNode;
  const tabGroup = tabList.parentNode;

  tabList
    .querySelectorAll(':scope > [aria-selected="true"]')
    .forEach((t) => t.setAttribute("aria-selected", false));

  targetTab.setAttribute("aria-selected", true);

  tabGroup
    .querySelectorAll(':scope > [role="tabpanel"]')
    .forEach((p) => p.setAttribute("hidden", true));

  tabGroup
    .querySelector(`#${targetTab.getAttribute("aria-controls")}`)
    .removeAttribute("hidden");
}
