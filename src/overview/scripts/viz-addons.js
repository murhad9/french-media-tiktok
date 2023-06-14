/**
 * Initializes the div which will contain the information panel.
 */
export function initPanelDiv() {
  d3.select("#overview-heatmap").append("div").attr("id", "overview-panel");
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel(d) {
  const panel = d3.select("#overview-panel").style("visibility", "visible");

  const data = d.target.__data__;
  console.log(data);

  panel.selectAll("*").remove();

  // "FERMER" button
  // panel
  //   .append("div")
  //   .style("text-align", "right")
  //   .style("font-family", "Roboto")
  //   .style("font-size", "12px")
  //   .style("cursor", "pointer")
  //   .text("CLOSE")
  //   .on("click", () => {
  //     panel.style("visibility", "hidden");
  //     d3.select("#overview-graph-g .points .selected").classed(
  //       "selected",
  //       false
  //     );
  //   });

  // Media name
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(data["média"]);

  // Select year and month
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "18px")
    .text(data.date);

  // Number of videos
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "16px")
    .style("padding-top", "25px")
    .text(`Number of videos: ${data.count}`);

  // Number of views
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "16px")
    .style("padding-top", "25px")
    .text(`Total Views: ${data.vues}`);

  // Average views
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "16px")
    .style("padding-top", "3px")
    .text(`Total likes: ${data.likes}`);

  // Average likes
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "16px")
    .style("padding-top", "3px")
    .text(`Total comments: ${data.commentaires}`);

  // Average comments
  panel
    .append("div")
    .style("font-family", "Roboto")
    .style("font-size", "16px")
    .style("padding-top", "3px")
    .text(`Total shares: ${data.partages}`);
}

export function initButtons(switchAxis) {
  const buttonDiv = d3.select("#overview-controls");

  buttonDiv
    .append("button")
    .attr("class", "overview-button")
    .text("Views")
    .on("click", () => switchAxis("vues"));

  buttonDiv
    .append("button")
    .attr("class", "overview-button")
    .text("Likes")
    .on("click", () => switchAxis("likes"));

  buttonDiv
    .append("button")
    .attr("class", "overview-button")
    .text("Comments")
    .on("click", () => switchAxis("commentaires"));

  buttonDiv
    .append("button")
    .attr("class", "overview-button")
    .text("Shares")
    .on("click", () => switchAxis("partages"));
}
