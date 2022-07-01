/** MultilineChart.js */
import React from "react";
import * as d3 from "d3";

const MultilineChart = ({ data, dimensions }) => {
  const svgRef = React.useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  React.useEffect(() => {
    console.log("d3.extent(data[0].items", d3.extent(data[0].items))
    const commonBase = 0;
    //here we define the range and domain for both axes ,the base is set to 0
    const xScale = d3.scaleLinear()
      .domain([0, 25])
      .range([commonBase, width]);
    const yScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(data[0].items, (d) => parseFloat(d.stocks)) + 30
      ])
      .range([height,commonBase]); 
    // Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    // Add X grid lines with labels
    const xAxis = d3.axisBottom(xScale)
      .ticks(25)
      .tickSize(-height + margin.bottom)
      .tickFormat(d => d !==0 ? d : null);//this line hide the 0 of x axis to avoid double 0 on the chart

    console.log("-height + margin.bottom", -height + margin.bottom)

    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    xAxisGroup.select(".domain").remove();
    xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");

    xAxisGroup.selectAll("text")
      .attr("font-size", "0.75rem");
    // Add Y grid lines with labels
    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickSize(-width)

    const yAxisGroup = svg.append("g").call(yAxis);
    yAxisGroup.select(".domain").remove();
    yAxisGroup.selectAll("text")
      .attr("font-size", "0.75rem");
    // Draw the lines
    const line = d3.line()
      .x((d) => xScale(d.index))
      .y((d) => yScale(parseFloat(d.stocks)));
    svg.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d.items));
  }, [data]); // Redraw chart if data changes

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default MultilineChart;
