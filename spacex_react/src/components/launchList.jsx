import * as d3 from "d3";

const LaunchElement = (launch) => {
  const handleMouseOver = () => {
    const launchpad = d3.select(`#i${launch.launchpad}`);
    launchpad.attr("class", "highlightedLaunchpad");
    
    d3.select("#launchpads")
      .selectAll("path")
      .sort((a, b) => a.id === launch.launchpad ? 1 : -1);
  };
  
  const handleMouseLeave = () => {
    d3.select(`#i${launch.launchpad}`).attr("class", "launchpad");
  };

  return (
    <li 
      className="launchItem"
      key={launch.id}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {launch.name}
    </li>
  );
};

const LaunchList = ({ launches }) => (
  <aside className="aside" id="launchesContainer">
    <h3>Launches</h3>
    <div id="listContainer">
      <ul>
        {launches.map(launch => LaunchElement(launch))}
      </ul>
    </div>
  </aside>
);

export { LaunchList };