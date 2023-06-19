/**
 * Generates a "sort by" selection menu and appends it to the provided parent element.
 * The user can choose between four options: views, likes, comments and shares
 *
 * @param {Element} parent The parent element to which the menu will be appended
 * @param {object} items An object where each key is a string to display in the dropdown menu and where each value
 *                       will be passed to the onSelection callback upon selecting the corresponding string
 * @param {Function} onSelection A function which takes the selected item as a parameter
 */
export function append (parent, items, onSelection) {
  const container = createContainer()
  createSelect(container)
  createList(container)

  /**
   * Creates the container which will contain the dropdown menu.
   *
   * @returns {Element} The container element
   */
  function createContainer () {
    const container = document.createElement('div')
    container.setAttribute('class', 'dropdown-container')
    parent.appendChild(container)
    return container
  }

  /**
   * Creates the button which shows the rest of the dropdown menu.
   *
   * @param {Element} container The container to create the button in
   */
  function createSelect (container) {
    const select = document.createElement('div')
    select.setAttribute('class', 'dropdown-select-btn')
    select.addEventListener('click', () => {
      select.classList.toggle('open')
    })
    select.innerHTML = `
      <span class="dropdown-btn-text">${Object.keys(items)[0]}</span>
      <span class="dropdown-arrow-dwn">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    `
    container.appendChild(select)
  }

  /**
   * Creates the dropdown list.
   *
   * @param {Element} container The container to create the dropdown list in
   */
  function createList (container) {
    const list = document.createElement('ul')
    list.setAttribute('class', 'dropdown-list-items')
    Object.entries(items).forEach(item => {
      const listItem = document.createElement('li')
      listItem.setAttribute('class', 'dropdown-item')
      listItem.addEventListener('click', () => {
        onSelection(item[1])
        const select = container.querySelector('.dropdown-select-btn')
        const btnText = container.querySelector('.dropdown-btn-text')
        btnText.innerText = listItem.innerText
        select.classList.toggle('open')
      })
      listItem.innerHTML = `
        <span class="dropdown-item-text">${item[0]}</span>
      `
      list.appendChild(listItem)
    })
    container.appendChild(list)
  }
}
