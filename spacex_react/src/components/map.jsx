import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useRef, useEffect } from "react";

function Map(props) {
  if (!props.launchpads) {
    return <div></div>;
  }

  const containerRef = useRef(null);
  useEffect(() => {
    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 100 };

    let svg = d3.select(containerRef.current).select("svg");
    if (svg.empty()) {
      svg = d3.select(containerRef.current).append("svg");
    }
    svg.selectAll("*").remove();
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const projection = d3.geoMercator()
      .scale(70)
      .center([0, 20])
      .translate([width / 2 - margin.left, height / 2]);

    const mapGroup = svg.append("g");
    mapGroup.selectAll("path")
      .data(Geo.features)
      .enter()
      .append("path")
      .attr("class", "topo")
      .attr("d", d3.geoPath().projection(projection))
      .style("opacity", 0.85);

    const geoLaunchpads = [];
    for (let i = 0; i < props.launchpads.length; i++) {
      geoLaunchpads.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [props.launchpads[i].longitude, props.launchpads[i].latitude]
        },
        "properties": { "name": props.launchpads[i].name },
        "id": props.launchpads[i].id
      });
    }

    const path = d3.geoPath().projection(projection);
    const launchpadsGroup = svg.append("g");
    launchpadsGroup.attr("id", "launchpads")
      .selectAll("path")
      .data(geoLaunchpads)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => `i${d.id}`)
      .attr("class", "launchpad")
      .style("stroke-width", 1);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function (event) {
        mapGroup.attr('transform', event.transform);
        launchpadsGroup.attr('transform', event.transform);
      });

    svg.call(zoom);
  }, [props.launchpads]);

  return (
    <div 
      className="mapContainer map" 
      ref={containerRef}
    ></div>
  );
}

export { Map };