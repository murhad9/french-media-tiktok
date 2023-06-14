"use strict";

import * as helper from "./scripts/helper.js";
import * as preproc from "./scripts/preprocess.js";
import * as viz from "./scripts/heatmap_viz.js";
import * as legend from "./scripts/legend.js";
import * as hover from "./scripts/hover.js";
import * as addons from "./scripts/viz-addons.js";

import * as d3Chromatic from "d3-scale-chromatic";

/**
 * Loads the overview tab.
 *
 * @param {*} d3 The d3 library
 */
export function load(d3) {
  let bounds;
  let svgSize;
  let graphSize;

  let domainColumn = "vues";

  const margin = { top: 35, right: 200, bottom: 35, left: 200 };
  // TODO: Use this file for welcom vizs
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLog();
  const colorScale = d3.scaleSequential(d3Chromatic.interpolateBuPu);

  d3.csv("./data_source.csv", d3.autoType).then(function (data) {
    console.log("INITIAL DATA");
    console.log(data);
    // removes video in april 2023 because the month is not entirely covered in input data
    data = preproc.removeAfter(data, new Date("2023-03-30"));
    data = preproc.setYear(data);
    data = data.map((row) => {
      return {
        ...row,
        yearMonth: row.year + ">" + new Date(row.date).getMonth(),
      };
    });
    console.log(data);
    data = preproc.aggregateColumns(
      data,
      ["vues", "likes", "partages", "commentaires"],
      ["date"],
      ["yearMonth", "média"]
    );

    // viz.setColorScaleDomain(colorScale, data, "vuesAverageNormalized");

    // legend.initGradient(colorScale);
    // legend.initLegendBar();
    // legend.initLegendAxis();

    const g = helper.generateG(margin);

    helper.appendAxes(g);
    viz.appendLines(data);

    addons.initButtons(updateDomainColumn);

    setSizing();
    build();

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing() {
      bounds = d3.select(".overview-graph").node().getBoundingClientRect();

      svgSize = {
        width: bounds.width,
        height: 550,
      };

      graphSize = {
        width: svgSize.width - margin.right - margin.left,
        height: svgSize.height - margin.bottom - margin.top,
      };

      helper.setCanvasSize(svgSize.width, svgSize.height);
    }

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn(column) {
      domainColumn = column;
      build();
    }

    /**
     *   This function builds the graph.
     */
    function build() {
      viz.updateXScale(data, xScale, graphSize.width);
      viz.updateYScale(
        yScale,
        data,
        // preproc.getUniqueTimeBlocks(data),
        graphSize.height,
        domainColumn
      );

      viz.drawXAxis(xScale, graphSize.height);
      viz.drawYAxis(yScale, graphSize.width);

      viz.rotateYTicks();

      viz.updateLines(xScale, yScale, colorScale, data, domainColumn);

      hover.setRectHandler(
        xScale,
        yScale,
        hover.rectSelected,
        hover.rectUnselected,
        hover.selectTicks,
        hover.unselectTicks
      );

      legend.draw(
        margin.left / 2,
        margin.top + 5,
        graphSize.height - 10,
        15,
        "url(#gradient)",
        colorScale
      );
    }

    window.addEventListener("resize", () => {
      setSizing();
      build();
    });
  });
}
