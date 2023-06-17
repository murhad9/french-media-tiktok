"use strict";

import * as helper from "./scripts/helper.js";
import * as menu from "../components/media-selection-menu.js";
import * as preproc from "./scripts/preprocess.js";
import * as viz from "./scripts/heatmap_viz.js";
import * as addons from "./scripts/viz-addons.js";
import * as slider from "../components/slider.js";

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
  let selectedMediaList = [];

  const margin = { top: 10, right: 20, bottom: 35, left: 50 };
  // TODO: Use this file for welcom vizs
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLog();
  const colorScale = d3.scaleSequential(d3Chromatic.interpolateBuPu);

  d3.csv("./data_source.csv", d3.autoType).then(function (data) {
    // removes video in april 2023 because the month is not entirely covered in input data
    data = preproc.removeAfter(data, new Date("2023-03-30"));
    data = preproc.setYear(data);
    const mediaList = preproc.getMediaList(data);

    // creates the media selection component
    menu.append(
      document.querySelector("#overview-media-selection"),
      mediaList,
      updateSelectedMedia
    );

    slider.append(
      document.querySelector("#overview-controls"),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    );

    data = data.map((row) => {
      return {
        ...row,
        yearMonth: row.year + ">" + new Date(row.date).getMonth(),
      };
    });
    data = preproc.aggregateColumns(
      data,
      ["vues", "likes", "partages", "commentaires"],
      ["date"],
      ["yearMonth", "média"]
    );

    let dataFromTo = data;

    // viz.setColorScaleDomain(colorScale, data, "vuesAverageNormalized");

    // legend.initGradient(colorScale);
    // legend.initLegendBar();
    // legend.initLegendAxis();

    const g = helper.generateG(margin);

    helper.appendAxes(g);
    viz.appendLines(data);

    // addons.initPanelDiv();
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
     * Updates the plot with the selected media
     *
     * @param {string[]} mediaList The selected media
     */
    function updateSelectedMedia(mediaList) {
      selectedMediaList = mediaList;
      build();
    }

    /**
     * Updates the plot with the select date range
     */
    function updateSelectedDates(fromToDates) {
      dataFromTo = data;
      dataFromTo = dataFromTo.filter((row) => {
        return (
          new Date(row.date).getTime() > fromToDates.from.getTime() &&
          new Date(row.date).getTime() < fromToDates.to.getTime()
        );
      });
      build();
    }

    /**
     *   This function builds the graph.
     */
    function build() {
      viz.updateXScale(dataFromTo, xScale, graphSize.width);
      viz.updateYScale(
        yScale,
        dataFromTo,
        // preproc.getUniqueTimeBlocks(data),
        graphSize.height,
        domainColumn
      );

      viz.drawXAxis(xScale, graphSize.height);
      viz.drawYAxis(yScale, graphSize.width);

      viz.rotateYTicks();

      viz.updateLines(
        xScale,
        yScale,
        colorScale,
        dataFromTo,
        domainColumn,
        addons.displayPanel,
        selectedMediaList
      );
    }

    window.addEventListener("resize", () => {
      setSizing();
      build();
    });
  });
}
