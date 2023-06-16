/*
 * Initializes the media selection controls
 *
 * @param { function } callback function to update graph whenever the media selection changes
 */
export function initMediaSelection(
  updateSelectedMedia,
  selectedMediaList,
  mediaList
) {
  const select = document.getElementById("overview-add-media-select");

  // remove all select previous options
  while (select.options.length > 0) {
    select.remove(0);
  }

  // create options from all media that are not already selected
  mediaList.forEach((media) => {
    if (selectedMediaList.includes(media)) return;
    let newOption = new Option(media, media);
    select.add(newOption, undefined);
  });

  // add an unselected option
  let defaultOption = new Option("Select a media", undefined);
  select.add(defaultOption, 0);

  const mediaSelect = d3.select("#overview-add-media-select");
  mediaSelect.on("change", (d) => {
    let newSelectedMediaList = [...selectedMediaList, d.target.value];
    updateSelectedMedia(newSelectedMediaList);
  });

  // remove previous buttons
  d3.selectAll(".overview-deselect-media-button").remove();

  // append button for each selected media
  selectedMediaList.forEach((media) => {
    d3.select("#overview-media-selection")
      .append("button")
      .attr("class", "overview-deselect-media-button")
      .text(media)
      .on("click", (d) => {
        const newSelectedMediaList = selectedMediaList.filter(
          (m) => m !== d.target.innerText
        );
        updateSelectedMedia(newSelectedMediaList);
      });
  });
}
