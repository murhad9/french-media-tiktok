/* eslint-disable no-undef */

/**
 * Generates a time range slider and appends it to the provided parent element.
 *
 * Slider documentation: http://ionden.com/a/plugins/ion.rangeSlider/
 *
 * @param {Element} parent A text input element
 * @param {Date} min The minimum date
 * @param {Date} max The maximum date
 * @param {Function} onChange Callback function to call when the value of the slider changes.
 *                            This function takes one parameter containing the slider options.
 *                            Check the API documentation for more details.
 */
export function append (parent, min, max, onChange) {
  const slider = document.createElement('input')
  slider.setAttribute('type', 'text')
  parent.appendChild(slider)

  $(slider).ionRangeSlider({
    skin: 'round',
    type: 'double',
    min: min.valueOf(),
    max: max.valueOf(),
    hide_min_max: true,
    hide_from_to: false,
    force_edges: true,
    prettify: function (ts) {
      return new Date(ts).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    onChange: onChange
  })
}
