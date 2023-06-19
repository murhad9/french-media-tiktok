/**
 * Generates a "sort by" selection menu and appends it to the provided parent element.
 * The user can choose between four options: views, likes, comments and shares
 *
 * @param {Element} parent The parent element to which the menu will be appended
 * @param {Function} onSelection A function which takes a string list of the selected media as a parameter
 */
export function append(parent, items, itemTexts, onSelection) {
  const container = createContainer();
  createSelect(container);
  createList(container);

  /**
   * Creates the container which will contain the dropdown menu.
   *
   * @returns {Element} The container element
   */
  function createContainer() {
    const container = document.createElement("div");
    container.setAttribute("class", "media-container");
    parent.appendChild(container);
    return container;
  }

  /**
   * Creates the button which shows the rest of the dropdown menu.
   *
   * @param {Element} container The container to create the button in
   */
  function createSelect(container) {
    const select = document.createElement("div");
    select.setAttribute("class", "media-select-btn");
    select.addEventListener("click", () => {
      select.classList.toggle("open");
    });
    select.innerHTML = `
      <span class="media-btn-text">${itemTexts[0]}</span>
      <span class="media-arrow-dwn">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    `;
    container.appendChild(select);
  }

  /**
   * Creates the dropdown list.
   *
   * @param {Element} container The container to create the dropdown list in
   */
  function createList(container) {
    const list = document.createElement("ul");
    list.setAttribute("class", "media-list-items");
    itemTexts.forEach((text, i) => {
      const listItem = document.createElement("li");
      listItem.setAttribute("class", "media-item");
      listItem.addEventListener("click", () => {
        onSelection(items[i]);
        const select = container.querySelector(".media-select-btn");
        const btnText = container.querySelector(".media-btn-text");
        btnText.innerText = listItem.innerText;
        select.classList.toggle("open");
      });
      listItem.innerHTML = `
        <span class="media-item-text">${text}</span>
      `;
      list.appendChild(listItem);
    });
    container.appendChild(list);
  }
}
