import * as d3Collection from "d3-collection";

/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 * @param {string} targetColumn The column to use as domain
 */
export function setColorScaleDomain(colorScale, data, targetColumn) {
  const averageViews = data.map((entry) => entry[targetColumn]);
  colorScale.domain(d3.extent(averageViews));
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendLines(data) {
  // TODO : Append SVG rect elements
  // d3.select("svg").selectAll(".line").append("g").attr("class", "line");
  // // .data(sumstat)
  // // .enter()
  // // .append("path");
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {number} width The width of the diagram
 */
export function updateXScale(data, xScale, width) {
  const xExtent = d3.extent(data, (d) => new Date(d.date));

  xScale.domain(xExtent).range([0, width]);
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {object[]} timeBlocks The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale(yScale, data, height, domainColumn) {
  const yExtent = d3.extent(data, (row) => row[domainColumn]);

  yScale.domain(yExtent).range([height, 0]);
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis(xScale, height) {
  // TODO : Draw X axis
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  d3.select("#overview-graph-g .x")
    .attr("transform", `translate(0,${height})`)
    .attr("color", "white")
    .call(xAxisGenerator);
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis(yScale, width) {
  // TODO : Draw Y axis
  const yAxisGenerator = d3.axisLeft().scale(yScale);
  d3.select("#overview-graph-g .y")
    .attr("transform", `translate(${0},0)`)
    .attr("color", "white")
    .call(yAxisGenerator);
}

/**
 * Rotates the ticks on the Y axis 30 degrees towards the left.
 */
export function rotateYTicks() {
  // TODO : Rotate Y ticks.
  d3.selectAll("#overview-graph-g .y .tick").attr("transform", function () {
    return d3.select(this).attr("transform") + ` rotate(${-30})`;
  });
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 * @param {string} targetColumn The column to use as domain
 */
export function updateLines(
  xScale,
  yScale,
  colorScale,
  data,
  domainColumn,
  displayPanel,
  selectedMediaList
) {
  // TODO : Set position, size and fill of rectangles according to bound data

  let sumstat = d3Collection
    .nest()
    .key((d) => d["média"])
    .entries(data);

  d3.selectAll(".drawn-line").remove();
  d3.select("svg")
    .selectAll(".line")
    .append("g")
    .data(sumstat)
    .enter()
    .append("path")
    .attr("class", "drawn-line")
    .attr("d", (d) => {
      if (selectedMediaList.includes(d.key)) {
        return d3
          .line()
          .x((d) => xScale(new Date(d.date)))
          .y((d) => yScale(d[domainColumn]))
          .curve(d3.curveLinear)(d.values);
      }
      return null;
    })
    .attr("transform", "translate(50, 10)")
    .style("fill", "none")
    .style("stroke", "#803082")
    .style("stroke-width", "1")
    .on("mouseenter", function (d) {
      // draw other
      d3.select(this).style("stroke", "steelblue").style("stroke-width", "2");
      // draw the circles too
      d3.selectAll(".drawn-circle")
        .filter((circleData) => {
          return circleData["média"] === d.target.__data__.key;
        })
        .style("fill", "steelblue");
    })
    .on("mouseleave", function (d) {
      d3.select(this).style("stroke", "#803082").style("stroke-width", "1");
      // undraw the circles too
      d3.selectAll(".drawn-circle")
        .filter((circleData) => {
          return circleData["média"] === d.target.__data__.key;
        })
        .style("fill", "#803082");
    });

  d3.selectAll(".drawn-circle").remove();
  d3.select("svg")
    .selectAll(".circle")
    .append("g")
    .data(data)
    .join("circle")
    .attr("class", "drawn-circle")
    .filter((d) => {
      return selectedMediaList.includes(d["média"]);
    })
    .attr("r", "2")
    .attr("fill", "#803082")
    .attr("transform", (d) => {
      return `translate(${50 + xScale(new Date(d.date))}, ${
        10 + yScale(d[domainColumn])
      })`;
    })
    .on("mouseenter", function (d) {
      // draw other circles too
      d3.selectAll(".drawn-circle")
        .filter((circleData) => {
          return circleData["média"] === d.target.__data__["média"];
        })
        .style("fill", "steelblue");

      // draw the line too
      d3.selectAll(".drawn-line")
        .filter((lineData) => {
          return lineData.key === d.target.__data__["média"];
        })
        .style("stroke", "steelblue");

      // set hovered circle with higher radius
      d3.select(this).style("fill", "steelblue").attr("r", "4");
      displayPanel(d);
    })
    .on("mouseleave", function (d) {
      d3.select(this).style("fill", "#803082").attr("r", "2");

      // undraw other circles too
      d3.selectAll(".drawn-circle")
        .filter((circleData) => {
          return circleData["média"] === d.target.__data__["média"];
        })
        .style("fill", "#803082");

      // undraw the line too
      d3.selectAll(".drawn-line")
        .filter((lineData) => {
          return lineData.key === d.target.__data__["média"];
        })
        .style("stroke", "#803082");
    });
}
