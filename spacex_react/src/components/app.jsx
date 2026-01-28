import { LaunchList } from "./launchList";
import { Map } from "./map";
import { useEffect, useState, useRef } from "react";
import { SpaceX } from "../api/spacex";

function App() {
  const [launches, setLaunches] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);
  const [highlightedPad, setHighlightedPad] = useState(null);
  const mapRef = useRef(null);
  const spacex = new SpaceX();

  useEffect(() => {
    spacex.launches().then(data => setLaunches(data));
    spacex.launchpads().then(data => setLaunchpads(data));
  }, []);

  const handleLaunchHover = (launchpadId) => {
    setHighlightedPad(launchpadId);
    if (mapRef.current && typeof mapRef.current.highlight === "function") {
      mapRef.current.highlight(launchpadId);
    }
  };

  const handleLaunchLeave = () => {
    setHighlightedPad(null);
    if (mapRef.current && typeof mapRef.current.reset === "function") {
      mapRef.current.reset();
    }
  };

  return (
    <main className="main">
      <LaunchList 
        launches={launches}
        onHover={handleLaunchHover}
        onLeave={handleLaunchLeave}
      />
      <Map 
        ref={mapRef}
        launchpads={launchpads}
        highlightedPad={highlightedPad}
      />
    </main>
  );
}

export { App };
