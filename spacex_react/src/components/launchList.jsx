function LaunchList({ launches, onHover, onLeave }) {
  if (launches.length === 0) {
    return (
      <aside className="aside">
        <h3>Launches</h3>
        <p>Loading launches...</p>
      </aside>
    );
  }

  return (
    <aside className="aside">
      <h3>Launches ({launches.length})</h3>
      <div id="listContainer">
        <ul>
          {launches.map(launch => (
            <li
              key={launch.id}
              className="launchItem"
              onMouseEnter={() => onHover(launch.launchpad)}
              onMouseLeave={onLeave}
            >
              {launch.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export { LaunchList };