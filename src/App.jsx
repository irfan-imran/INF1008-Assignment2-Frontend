import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const DEFAULT_CENTER = [1.3521, 103.8198];

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const homeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const friendIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitToMarkers({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) return;

    if (positions.length === 1) {
      map.setView(positions[0], 15);
      return;
    }

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, positions]);

  return null;
}

function App() {
  const [homePostalCodeInput, setHomePostalCodeInput] = useState("");
  const [homePostalCode, setHomePostalCode] = useState(
    localStorage.getItem("homePostalCode") || "",
  );
  const [homeLocation, setHomeLocation] = useState(null);

  const [friendNameInput, setFriendNameInput] = useState("");
  const [friendPostalCodeInput, setFriendPostalCodeInput] = useState("");
  const [friends, setFriends] = useState([]);

  const [routeResult, setRouteResult] = useState(null);
  const [loadingHome, setLoadingHome] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);
  const [planningRoute, setPlanningRoute] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!homePostalCode) return;
    setHomePostalCodeInput(homePostalCode);
    fetchLocation(homePostalCode, "You", setHomeLocation, setLoadingHome);
  }, []);

  async function callApi(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || "Something went wrong.");
    }

    return data;
  }

  async function fetchLocation(postalCode, label, setter, loadingSetter) {
    setErrorMessage("");
    loadingSetter(true);

    try {
      const data = await callApi("/api/geocode", {
        method: "POST",
        body: JSON.stringify({
          postal_code: postalCode,
          label,
        }),
      });
      setter(data.location);
    } catch (error) {
      setter(null);
      setErrorMessage(error.message);
    } finally {
      loadingSetter(false);
    }
  }

  async function handleSaveHome(event) {
    event.preventDefault();

    const cleaned = homePostalCodeInput.trim();
    if (!cleaned) {
      setErrorMessage("Please enter your home postal code first.");
      return;
    }

    setHomePostalCode(cleaned);
    localStorage.setItem("homePostalCode", cleaned);
    setRouteResult(null);

    await fetchLocation(cleaned, "You", setHomeLocation, setLoadingHome);
  }

  async function handleAddFriend(event) {
    event.preventDefault();
    setErrorMessage("");

    const postalCode = friendPostalCodeInput.trim();
    const label = friendNameInput.trim() || `Friend ${friends.length + 1}`;

    if (!postalCode) {
      setErrorMessage("Please enter a friend postal code.");
      return;
    }

    setAddingFriend(true);

    try {
      const data = await callApi("/api/geocode", {
        method: "POST",
        body: JSON.stringify({
          postal_code: postalCode,
          label,
        }),
      });

      const location = data.location;

      setFriends((previous) => {
        const exists = previous.some(
          (friend) => friend.postal_code === location.postal_code,
        );

        if (exists) {
          return previous;
        }

        return [
          ...previous,
          {
            id: `${location.postal_code}-${Date.now()}`,
            ...location,
          },
        ];
      });

      setFriendNameInput("");
      setFriendPostalCodeInput("");
      setRouteResult(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setAddingFriend(false);
    }
  }

  function handleRemoveFriend(id) {
    setFriends((previous) => previous.filter((friend) => friend.id !== id));
    setRouteResult(null);
  }

  async function handlePlanRoute() {
    setErrorMessage("");

    if (!homePostalCode) {
      setErrorMessage("Set your home postal code first.");
      return;
    }

    if (!friends.length) {
      setErrorMessage("Add at least one friend before computing the MST.");
      return;
    }

    setPlanningRoute(true);

    try {
      const data = await callApi("/api/plan-route", {
        method: "POST",
        body: JSON.stringify({
          home_postal_code: homePostalCode,
          home_label: "You",
          friends: friends.map((friend) => ({
            postal_code: friend.postal_code,
            label: friend.label,
          })),
        }),
      });

      setRouteResult(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setPlanningRoute(false);
    }
  }

  const markerItems = [];

  if (homeLocation) {
    markerItems.push({
      ...homeLocation,
      kind: "home",
    });
  }

  friends.forEach((friend) => {
    markerItems.push({
      ...friend,
      kind: "friend",
    });
  });

  const mapPositions = markerItems.map((item) => [
    item.latitude,
    item.longitude,
  ]);

  if (routeResult && routeResult.polyline_segments) {
    routeResult.polyline_segments.forEach((segment) => {
      segment.forEach((point) => {
        mapPositions.push(point);
      });
    });
  }

  return (
    <div className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">INF1008 Demo</p>
          <h1>Friend Hitch Ride Planner</h1>
          <p className="hero-text">
            Enter your postal code once, add your friends, then compute a
            minimum spanning tree using Prim&apos;s algorithm. Pins are shown on
            the map and the MST construction steps are listed clearly.
          </p>
        </div>
        <div className="hero-badge">Singapore postal codes</div>
      </header>

      <main className="layout-grid">
        <section className="panel">
          <h2>1. Set your location</h2>
          <form onSubmit={handleSaveHome} className="stack-form">
            <label>
              Your postal code
              <input
                type="text"
                value={homePostalCodeInput}
                onChange={(event) => setHomePostalCodeInput(event.target.value)}
                placeholder="e.g. 238801"
                maxLength={6}
              />
            </label>
            <button
              type="submit"
              className="primary-button"
              disabled={loadingHome}
            >
              {loadingHome ? "Saving..." : "Save home postal code"}
            </button>
          </form>

          {homeLocation && (
            <div className="info-box success-box">
              <strong>Saved:</strong> {homeLocation.label} (
              {homeLocation.postal_code})
            </div>
          )}

          <h2>2. Add friends</h2>
          <form onSubmit={handleAddFriend} className="stack-form">
            <label>
              Friend name
              <input
                type="text"
                value={friendNameInput}
                onChange={(event) => setFriendNameInput(event.target.value)}
                placeholder="Optional"
              />
            </label>
            <label>
              Friend postal code
              <input
                type="text"
                value={friendPostalCodeInput}
                onChange={(event) =>
                  setFriendPostalCodeInput(event.target.value)
                }
                placeholder="e.g. 018956"
                maxLength={6}
              />
            </label>
            <button
              type="submit"
              className="secondary-button"
              disabled={addingFriend}
            >
              {addingFriend ? "Adding..." : "Add friend"}
            </button>
          </form>

          <div className="friend-list-wrapper">
            <h3>Friend list</h3>
            {friends.length === 0 ? (
              <p className="muted-text">No friends added yet.</p>
            ) : (
              <ul className="friend-list">
                {friends.map((friend, index) => (
                  <li key={friend.id} className="friend-row">
                    <div>
                      <strong>
                        {index + 1}. {friend.label}
                      </strong>
                      <div className="small-text">{friend.postal_code}</div>
                    </div>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h2>3. Compute MST</h2>
          <button
            type="button"
            className="primary-button full-width"
            onClick={handlePlanRoute}
            disabled={planningRoute}
          >
            {planningRoute ? "Computing MST..." : "Compute Prim MST"}
          </button>

          <div className="note-box">
            <strong>Note:</strong> the map shows the MST as straight line
            segments between geocoded points. This is a simple educational demo,
            not real road navigation.
          </div>

          {errorMessage && (
            <div className="info-box error-box">{errorMessage}</div>
          )}
        </section>

        <section className="panel map-panel">
          <div className="map-header">
            <div>
              <h2>Map view</h2>
              <p className="muted-text">Home is red. Friends are blue.</p>
            </div>
          </div>

          <div className="map-wrapper">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={12}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {markerItems.map((item) => (
                <Marker
                  key={`${item.kind}-${item.postal_code}`}
                  position={[item.latitude, item.longitude]}
                  icon={item.kind === "home" ? homeIcon : friendIcon}
                >
                  <Popup>
                    <strong>{item.label}</strong>
                    <br />
                    {item.postal_code}
                  </Popup>
                </Marker>
              ))}

              {routeResult &&
                routeResult.polyline_segments &&
                routeResult.polyline_segments.map((segment, index) => (
                  <Polyline key={index} positions={segment} />
                ))}

              <FitToMarkers positions={mapPositions} />
            </MapContainer>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h3>Algorithm used</h3>
              <p>{routeResult ? routeResult.algorithm_used : "—"}</p>
              <p className="small-text">
                {routeResult
                  ? routeResult.algorithm_note
                  : "Compute the MST to see details."}
              </p>
            </div>

            <div className="result-card">
              <h3>Total tree distance</h3>
              <p>
                {routeResult ? `${routeResult.total_tree_distance_km} km` : "—"}
              </p>
              <p className="small-text">Approximate MST weight.</p>
            </div>
          </div>

          <div className="sequence-card">
            <h3>Order vertices were added</h3>
            {!routeResult ? (
              <p className="muted-text">
                The Prim order will appear here after computation.
              </p>
            ) : (
              <ol className="sequence-list">
                {routeResult.ordered_stops.map((stop) => (
                  <li key={`${stop.sequence}-${stop.postal_code}`}>
                    <strong>{stop.label}</strong> — {stop.postal_code}
                    <span className="badge">{stop.stop_type}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="sequence-card">
            <h3>MST edges</h3>
            {!routeResult ? (
              <p className="muted-text">
                The MST edges will appear here after computation.
              </p>
            ) : (
              <ul className="steps-list">
                {routeResult.mst_edges.map((edge, index) => (
                  <li key={index}>
                    <div className="step-title">
                      {edge.from} → {edge.to}
                    </div>
                    <div className="small-text">
                      {edge.from_postal_code} → {edge.to_postal_code}
                    </div>
                    <div className="small-text">
                      Edge weight: {edge.distance_km} km
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sequence-card">
            <h3>Execution steps</h3>
            {!routeResult ? (
              <p className="muted-text">Step-by-step execution appears here.</p>
            ) : (
              <ol className="steps-list">
                {routeResult.steps.map((step) => (
                  <li key={step.step}>
                    <div className="step-title">
                      Step {step.step}: {step.from} → {step.to}
                    </div>
                    <div className="small-text">
                      Edge distance: {step.distance_km} km | Cumulative tree
                      weight: {step.cumulative_tree_distance_km} km
                    </div>
                    <div className="small-text">{step.reason}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
