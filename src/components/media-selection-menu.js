/**
 * Generates a media selection menu and appends it to the provided parent element.
 *
 * @param {Element} parent The parent element to which the menu will be appended
 * @param {string[]} items A list of strings to display in the dropdown menu
 * @param {Function} onSelection A function which takes a string of the selected media as a parameter
 */
export function append (parent, items, onSelection) {
  const container = createContainer()
  createButton(container)
  createList(container)

  const buttons = container.appendChild(document.createElement('div'))
  createSelectAllButton(buttons)
  createRemoveAllButton(buttons)

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
  function createButton (container) {
    const selectBtn = document.createElement('div')
    selectBtn.setAttribute('class', 'dropdown-select-btn')
    selectBtn.addEventListener('click', () => {
      selectBtn.classList.toggle('open')
    })
    selectBtn.innerHTML = `
      <span class="dropdown-btn-text">Select Media</span>
      <span class="dropdown-arrow-dwn">
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
    list.setAttribute('class', 'dropdown-list-items')
    items.forEach(item => {
      const listItem = document.createElement('li')
      listItem.setAttribute('class', 'dropdown-item')
      listItem.addEventListener('click', () => {
        listItem.classList.toggle('checked')
        const checkedElements = container.querySelectorAll('.checked')
        const checkedMedia = Array.from(checkedElements).map(element => element.innerText)
        const btnText = container.querySelector('.dropdown-btn-text')
        if (checkedElements && checkedElements.length > 0) {
          btnText.innerText = `${checkedElements.length} Selected`
        } else {
          btnText.innerText = 'Select Media'
        }
        onSelection(checkedMedia)
      })
      listItem.innerHTML = `
        <span class="dropdown-checkbox">
          <i class="fa-solid fa-check dropdown-check-icon"></i>
        </span>
        <span class="dropdown-item-text">${item}</span>
      `
      list.appendChild(listItem)
    })
    container.appendChild(list)
  }

  /**
   * Creates the 'Select all media' button.
   *
   * @param {*} container The container to create the button in
   */
  function createSelectAllButton (container) {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.classList.add('dropdown-select-all')
    button.innerText = 'Select all media'
    button.addEventListener('click', () => {
      const listItems = container.parentElement.querySelectorAll('li')
      const btnText = container.parentElement.querySelector('.dropdown-btn-text')
      listItems.forEach(listItem => listItem.classList.add('checked'))
      btnText.innerText = `${items.length} Selected`
      onSelection(items)
    })
    container.appendChild(button)
  }

  /**
   * Creates the 'Remove all media' button.
   *
   * @param {*} container The container to create the button in
   */
  function createRemoveAllButton (container) {
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.innerText = 'Remove all media'
    button.classList.add('dropdown-remove-all')
    button.addEventListener('click', () => {
      const listItems = container.parentElement.querySelectorAll('li')
      const btnText = container.parentElement.querySelector('.dropdown-btn-text')
      listItems.forEach(listItem => listItem.classList.remove('checked'))
      btnText.innerText = 'Select Media'
      onSelection([])
    })
    container.appendChild(button)
  }
}
