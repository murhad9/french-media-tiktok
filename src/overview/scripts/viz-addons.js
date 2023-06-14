export function initButtons(switchAxis) {
  const buttonDiv = d3
    .select("#overview-viz-wrapper")
    .append("div")
    .attr("id", "overview-sidebar-buttons");

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
