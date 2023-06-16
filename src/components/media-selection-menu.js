/**
 * Generates a media selection menu and appends it to the provided parent element.
 *
 * @param {Element} parent The parent element to which the menu will be appended
 * @param {string[]} items A list of strings to display in the dropdown menu
 */
export function append (parent, items) {
  const container = createContainer()
  createButton(container)
  createList(container)

  /**
   * Creates the container which will contain the dropdown menu.
   *
   * @returns {Element} The container element
   */
  function createContainer () {
    const container = document.createElement('div')
    container.setAttribute('class', 'media-container')
    parent.appendChild(container)
    return container
  }

  /**
   * Creates the button which shows the rest of the dropdown menu.
   *
   * @param {Element} container The container to create the button in
   */
  function createButton (container) {
    const selectBtn = document.createElement('div')
    selectBtn.setAttribute('class', 'media-select-btn')
    selectBtn.addEventListener('click', () => {
      selectBtn.classList.toggle('open')
    })
    selectBtn.innerHTML = `
      <span class="media-btn-text">Select Media</span>
      <span class="media-arrow-dwn">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    `
    container.appendChild(selectBtn)
  }

  /**
   * Creates the dropdown list.
   *
   * @param {Element} container The container to create the dropdown list in
   */
  function createList (container) {
    const list = document.createElement('ul')
    list.setAttribute('class', 'media-list-items')
    items.forEach(item => {
      const listItem = document.createElement('li')
      listItem.setAttribute('class', 'media-item')
      listItem.addEventListener('click', () => {
        listItem.classList.toggle('checked')
        const checked = container.querySelectorAll('.checked')
        const btnText = container.querySelector('.media-btn-text')
        if (checked && checked.length > 0) {
          btnText.innerText = `${checked.length} Selected`
        } else {
          btnText.innerText = 'Select Media'
        }
      })
      listItem.innerHTML = `
        <span class="media-checkbox">
          <i class="fa-solid fa-check media-check-icon"></i>
        </span>
        <span class="media-item-text">${item}</span>
      `
      list.appendChild(listItem)
    })
    container.appendChild(list)
  }
}
