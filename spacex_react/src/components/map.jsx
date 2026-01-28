import * as d3 from "d3";
import Geo from "../geo.json";
import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

const Map = forwardRef(({ launchpads, highlightedPad }, ref) => {
  const MAP_CONFIG = {
    width: 1000,
    height: 600,
    margin: { top: 20, right: 20, bottom: 20, left: 100 },
    projection: {
      scale: 70,
      center: [0, 20]
    }
  };

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const projectionRef = useRef(null);
  const launchpadsGroupRef = useRef(null);

  const drawLaunchpads = useCallback(() => {
    if (!launchpadsGroupRef.current || !projectionRef.current || !launchpads) return;

    const launchpadsGroup = d3.select(launchpadsGroupRef.current);

    const circles = launchpadsGroup
      .selectAll(".launchpad")
      .data(launchpads, d => d.id);

    const enter = circles.enter()
      .append("circle")
      .attr("class", "launchpad")
      .attr("cx", d => projectionRef.current([d.longitude, d.latitude])[0])
      .attr("cy", d => projectionRef.current([d.longitude, d.latitude])[1])
      .attr("r", 5)
      .attr("data-id", d => d.id);

    enter.append("title")
      .text(d => d.name || d.full_name || `Launchpad ${d.id}`);

    launchpadsGroup.selectAll(".launchpad")
      .attr("cx", d => projectionRef.current([d.longitude, d.latitude])[0])
      .attr("cy", d => projectionRef.current([d.longitude, d.latitude])[1])
      .attr("r", d => highlightedPad === d.id ? 8 : 5)
      .style("fill", d => highlightedPad === d.id ? "#ffeb3b" : "#f44336")
      .style("opacity", d => highlightedPad === d.id ? 1 : 0.6)
      .style("stroke", d => highlightedPad === d.id ? "#333" : "none")
      .style("stroke-width", d => highlightedPad === d.id ? 2 : 0);

    circles.exit().remove();

  }, [launchpads, highlightedPad]);

  const highlight = useCallback((launchpadId) => {
    if (!launchpadsGroupRef.current) return;

    const launchpadsGroup = d3.select(launchpadsGroupRef.current);

    launchpadsGroup.selectAll(".launchpad")
      .style("opacity", 0.6)
      .style("fill", "#f44336")
      .attr("r", 5)
      .style("stroke", "none");

    launchpadsGroup.selectAll(`.launchpad[data-id="${launchpadId}"]`)
      .style("opacity", 1)
      .style("fill", "#ffeb3b")
      .attr("r", 8)
      .style("stroke", "#333")
      .style("stroke-width", 2)
      .raise();
  }, []);

  const reset = useCallback(() => {
    if (!launchpadsGroupRef.current) return;

    const launchpadsGroup = d3.select(launchpadsGroupRef.current);

    launchpadsGroup.selectAll(".launchpad")
      .style("opacity", 0.6)
      .style("fill", "#f44336")
      .attr("r", 5)
      .style("stroke", "none");
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height, margin, projection: projConfig } = MAP_CONFIG;

    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "map-svg");

    svgRef.current = svg.node();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const projection = d3.geoMercator()
      .scale(projConfig.scale)
      .center(projConfig.center)
      .translate([width / 2 - margin.left, height / 2 - margin.top]);

    projectionRef.current = projection;

    g.selectAll(".country")
      .data(Geo.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", d3.geoPath().projection(projection))
      .style("fill", "#f5f5f5")
      .style("stroke", "#ddd")
      .style("stroke-width", 0.5);

    launchpadsGroupRef.current = g.append("g")
      .attr("class", "launchpads-group")
      .node();

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      if (containerRef.current) {
        d3.select(containerRef.current).selectAll("*").remove();
      }
    };
  }, []);

  useEffect(() => {
    drawLaunchpads();
  }, [drawLaunchpads]);

  useEffect(() => {
    if (highlightedPad) {
      highlight(highlightedPad);
    } else {
      reset();
    }
  }, [highlightedPad, highlight, reset]);

  useImperativeHandle(ref, () => ({
    highlight,
    reset,
    drawLaunchpads,
    getProjection: () => projectionRef.current,
    getLaunchpadsGroup: () => launchpadsGroupRef.current
  }));

  return (
    <div 
      className="mapContainer map"
      ref={containerRef}
      role="application"
      aria-label="World map with launchpad locations"
    />
  );
});

Map.displayName = 'Map';

export { Map };
