// import { useEffect, useState } from "react";
// import L from "leaflet";
// import {
//   MapContainer,
//   Marker,
//   Polyline,
//   Popup,
//   TileLayer,
//   useMap,
// } from "react-leaflet";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
// const DEFAULT_CENTER = [1.3521, 103.8198];

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const homeIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const friendIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// function FitToMarkers({ positions }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!positions.length) return;

//     if (positions.length === 1) {
//       map.setView(positions[0], 15);
//       return;
//     }

//     const bounds = L.latLngBounds(positions);
//     map.fitBounds(bounds, { padding: [40, 40] });
//   }, [map, positions]);

//   return null;
// }

// function App() {
//   const [homePostalCodeInput, setHomePostalCodeInput] = useState("");
//   const [homePostalCode, setHomePostalCode] = useState(
//     localStorage.getItem("homePostalCode") || "",
//   );
//   const [homeLocation, setHomeLocation] = useState(null);

//   const [friendNameInput, setFriendNameInput] = useState("");
//   const [friendPostalCodeInput, setFriendPostalCodeInput] = useState("");
//   const [friends, setFriends] = useState([]);

//   const [routeResult, setRouteResult] = useState(null);
//   const [loadingHome, setLoadingHome] = useState(false);
//   const [addingFriend, setAddingFriend] = useState(false);
//   const [planningRoute, setPlanningRoute] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     if (!homePostalCode) return;
//     setHomePostalCodeInput(homePostalCode);
//     fetchLocation(homePostalCode, "You", setHomeLocation, setLoadingHome);
//   }, []);

//   async function callApi(path, options = {}) {
//     const response = await fetch(`${API_BASE_URL}${path}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       ...options,
//     });

//     const data = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       throw new Error(data.detail || "Something went wrong.");
//     }

//     return data;
//   }

//   async function fetchLocation(postalCode, label, setter, loadingSetter) {
//     setErrorMessage("");
//     loadingSetter(true);

//     try {
//       const data = await callApi("/api/geocode", {
//         method: "POST",
//         body: JSON.stringify({
//           postal_code: postalCode,
//           label,
//         }),
//       });
//       setter(data.location);
//     } catch (error) {
//       setter(null);
//       setErrorMessage(error.message);
//     } finally {
//       loadingSetter(false);
//     }
//   }

//   async function handleSaveHome(event) {
//     event.preventDefault();

//     const cleaned = homePostalCodeInput.trim();
//     if (!cleaned) {
//       setErrorMessage("Please enter your home postal code first.");
//       return;
//     }

//     setHomePostalCode(cleaned);
//     localStorage.setItem("homePostalCode", cleaned);
//     setRouteResult(null);

//     await fetchLocation(cleaned, "You", setHomeLocation, setLoadingHome);
//   }

//   async function handleAddFriend(event) {
//     event.preventDefault();
//     setErrorMessage("");

//     const postalCode = friendPostalCodeInput.trim();
//     const label = friendNameInput.trim() || `Friend ${friends.length + 1}`;

//     if (!postalCode) {
//       setErrorMessage("Please enter a friend postal code.");
//       return;
//     }

//     setAddingFriend(true);

//     try {
//       const data = await callApi("/api/geocode", {
//         method: "POST",
//         body: JSON.stringify({
//           postal_code: postalCode,
//           label,
//         }),
//       });

//       const location = data.location;

//       setFriends((previous) => {
//         const exists = previous.some(
//           (friend) => friend.postal_code === location.postal_code,
//         );

//         if (exists) {
//           return previous;
//         }

//         return [
//           ...previous,
//           {
//             id: `${location.postal_code}-${Date.now()}`,
//             ...location,
//           },
//         ];
//       });

//       setFriendNameInput("");
//       setFriendPostalCodeInput("");
//       setRouteResult(null);
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setAddingFriend(false);
//     }
//   }

//   function handleRemoveFriend(id) {
//     setFriends((previous) => previous.filter((friend) => friend.id !== id));
//     setRouteResult(null);
//   }

//   async function handlePlanRoute() {
//     setErrorMessage("");

//     if (!homePostalCode) {
//       setErrorMessage("Set your home postal code first.");
//       return;
//     }

//     if (!friends.length) {
//       setErrorMessage("Add at least one friend before computing the MST.");
//       return;
//     }

//     setPlanningRoute(true);

//     try {
//       const data = await callApi("/api/plan-route", {
//         method: "POST",
//         body: JSON.stringify({
//           home_postal_code: homePostalCode,
//           home_label: "You",
//           friends: friends.map((friend) => ({
//             postal_code: friend.postal_code,
//             label: friend.label,
//           })),
//         }),
//       });

//       setRouteResult(data);
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setPlanningRoute(false);
//     }
//   }

//   const markerItems = [];

//   if (homeLocation) {
//     markerItems.push({
//       ...homeLocation,
//       kind: "home",
//     });
//   }

//   friends.forEach((friend) => {
//     markerItems.push({
//       ...friend,
//       kind: "friend",
//     });
//   });

//   const mapPositions = markerItems.map((item) => [
//     item.latitude,
//     item.longitude,
//   ]);

//   if (routeResult && routeResult.polyline_segments) {
//     routeResult.polyline_segments.forEach((segment) => {
//       segment.forEach((point) => {
//         mapPositions.push(point);
//       });
//     });
//   }

//   return (
//     <div className="page-shell">
//       <header className="hero-card">
//         <div>
//           <p className="eyebrow">INF1008 Demo</p>
//           <h1>Friend Hitch Ride Planner</h1>
//           <p className="hero-text">
//             Enter your postal code once, add your friends, then compute a
//             minimum spanning tree using Prim&apos;s algorithm. Pins are shown on
//             the map and the MST construction steps are listed clearly.
//           </p>
//         </div>
//         <div className="hero-badge">Singapore postal codes</div>
//       </header>

//       <main className="layout-grid">
//         <section className="panel">
//           <h2>1. Set your location</h2>
//           <form onSubmit={handleSaveHome} className="stack-form">
//             <label>
//               Your postal code
//               <input
//                 type="text"
//                 value={homePostalCodeInput}
//                 onChange={(event) => setHomePostalCodeInput(event.target.value)}
//                 placeholder="e.g. 238801"
//                 maxLength={6}
//               />
//             </label>
//             <button
//               type="submit"
//               className="primary-button"
//               disabled={loadingHome}
//             >
//               {loadingHome ? "Saving..." : "Save home postal code"}
//             </button>
//           </form>

//           {homeLocation && (
//             <div className="info-box success-box">
//               <strong>Saved:</strong> {homeLocation.label} (
//               {homeLocation.postal_code})
//             </div>
//           )}

//           <h2>2. Add friends</h2>
//           <form onSubmit={handleAddFriend} className="stack-form">
//             <label>
//               Friend name
//               <input
//                 type="text"
//                 value={friendNameInput}
//                 onChange={(event) => setFriendNameInput(event.target.value)}
//                 placeholder="Optional"
//               />
//             </label>
//             <label>
//               Friend postal code
//               <input
//                 type="text"
//                 value={friendPostalCodeInput}
//                 onChange={(event) =>
//                   setFriendPostalCodeInput(event.target.value)
//                 }
//                 placeholder="e.g. 018956"
//                 maxLength={6}
//               />
//             </label>
//             <button
//               type="submit"
//               className="secondary-button"
//               disabled={addingFriend}
//             >
//               {addingFriend ? "Adding..." : "Add friend"}
//             </button>
//           </form>

//           <div className="friend-list-wrapper">
//             <h3>Friend list</h3>
//             {friends.length === 0 ? (
//               <p className="muted-text">No friends added yet.</p>
//             ) : (
//               <ul className="friend-list">
//                 {friends.map((friend, index) => (
//                   <li key={friend.id} className="friend-row">
//                     <div>
//                       <strong>
//                         {index + 1}. {friend.label}
//                       </strong>
//                       <div className="small-text">{friend.postal_code}</div>
//                     </div>
//                     <button
//                       type="button"
//                       className="ghost-button"
//                       onClick={() => handleRemoveFriend(friend.id)}
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <h2>3. Compute MST</h2>
//           <button
//             type="button"
//             className="primary-button full-width"
//             onClick={handlePlanRoute}
//             disabled={planningRoute}
//           >
//             {planningRoute ? "Computing MST..." : "Compute Prim MST"}
//           </button>

//           <div className="note-box">
//             <strong>Note:</strong> the map shows the MST as straight line
//             segments between geocoded points. This is a simple educational demo,
//             not real road navigation.
//           </div>

//           {errorMessage && (
//             <div className="info-box error-box">{errorMessage}</div>
//           )}
//         </section>

//         <section className="panel map-panel">
//           <div className="map-header">
//             <div>
//               <h2>Map view</h2>
//               <p className="muted-text">Home is red. Friends are blue.</p>
//             </div>
//           </div>

//           <div className="map-wrapper">
//             <MapContainer
//               center={DEFAULT_CENTER}
//               zoom={12}
//               scrollWheelZoom
//               style={{ height: "100%", width: "100%" }}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />

//               {markerItems.map((item) => (
//                 <Marker
//                   key={`${item.kind}-${item.postal_code}`}
//                   position={[item.latitude, item.longitude]}
//                   icon={item.kind === "home" ? homeIcon : friendIcon}
//                 >
//                   <Popup>
//                     <strong>{item.label}</strong>
//                     <br />
//                     {item.postal_code}
//                   </Popup>
//                 </Marker>
//               ))}

//               {routeResult &&
//                 routeResult.polyline_segments &&
//                 routeResult.polyline_segments.map((segment, index) => (
//                   <Polyline key={index} positions={segment} />
//                 ))}

//               <FitToMarkers positions={mapPositions} />
//             </MapContainer>
//           </div>

//           <div className="results-grid">
//             <div className="result-card">
//               <h3>Algorithm used</h3>
//               <p>{routeResult ? routeResult.algorithm_used : "—"}</p>
//               <p className="small-text">
//                 {routeResult
//                   ? routeResult.algorithm_note
//                   : "Compute the MST to see details."}
//               </p>
//             </div>

//             <div className="result-card">
//               <h3>Total tree distance</h3>
//               <p>
//                 {routeResult ? `${routeResult.total_tree_distance_km} km` : "—"}
//               </p>
//               <p className="small-text">Approximate MST weight.</p>
//             </div>
//           </div>

//           <div className="sequence-card">
//             <h3>Order vertices were added</h3>
//             {!routeResult ? (
//               <p className="muted-text">
//                 The Prim order will appear here after computation.
//               </p>
//             ) : (
//               <ol className="sequence-list">
//                 {routeResult.ordered_stops.map((stop) => (
//                   <li key={`${stop.sequence}-${stop.postal_code}`}>
//                     <strong>{stop.label}</strong> — {stop.postal_code}
//                     <span className="badge">{stop.stop_type}</span>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </div>

//           <div className="sequence-card">
//             <h3>MST edges</h3>
//             {!routeResult ? (
//               <p className="muted-text">
//                 The MST edges will appear here after computation.
//               </p>
//             ) : (
//               <ul className="steps-list">
//                 {routeResult.mst_edges.map((edge, index) => (
//                   <li key={index}>
//                     <div className="step-title">
//                       {edge.from} → {edge.to}
//                     </div>
//                     <div className="small-text">
//                       {edge.from_postal_code} → {edge.to_postal_code}
//                     </div>
//                     <div className="small-text">
//                       Edge weight: {edge.distance_km} km
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className="sequence-card">
//             <h3>Execution steps</h3>
//             {!routeResult ? (
//               <p className="muted-text">Step-by-step execution appears here.</p>
//             ) : (
//               <ol className="steps-list">
//                 {routeResult.steps.map((step) => (
//                   <li key={step.step}>
//                     <div className="step-title">
//                       Step {step.step}: {step.from} → {step.to}
//                     </div>
//                     <div className="small-text">
//                       Edge distance: {step.distance_km} km | Cumulative tree
//                       weight: {step.cumulative_tree_distance_km} km
//                     </div>
//                     <div className="small-text">{step.reason}</div>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    color: "#0f172a",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    padding: "20px",
  },
  shell: {
    maxWidth: "1380px",
    margin: "0 auto",
  },
  hero: {
    background: "#ffffff",
    border: "1px solid #d9e2ef",
    borderRadius: "22px",
    padding: "20px 22px",
    marginBottom: "18px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "#e8eefc",
    color: "#1d4ed8",
    fontSize: "0.78rem",
    fontWeight: 800,
    marginBottom: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "310px 1fr",
    gap: "18px",
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #d9e2ef",
    borderRadius: "22px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  },
  sidebar: {
    padding: "16px",
    position: "sticky",
    top: "18px",
  },
  main: {
    padding: "14px",
  },
  sectionTitle: {
    fontSize: "0.98rem",
    fontWeight: 800,
    marginBottom: "10px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
    fontSize: "0.9rem",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },
  buttonPrimary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 800,
    cursor: "pointer",
  },
  buttonGhost: {
    padding: "8px 11px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.84rem",
  },
  softBlock: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    background: "#f8fbff",
    padding: "12px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    border: "1px solid #dbe4f0",
    borderRadius: "14px",
    padding: "10px 12px",
    background: "#ffffff",
    marginBottom: "8px",
  },
  controlsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "10px",
  },
  legendRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "10px",
    color: "#475569",
    fontSize: "0.84rem",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    display: "inline-block",
    marginRight: "6px",
    verticalAlign: "middle",
  },
  visualWrap: {
    position: "relative",
    border: "1px solid #dbe4f0",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #fbfdff 0%, #f6f9ff 100%)",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    zIndex: 2,
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #dbe4f0",
    borderRadius: "14px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    backdropFilter: "blur(6px)",
  },
  chipRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "0.8rem",
  },
  stepDots: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  timelineDot: {
    width: "14px",
    height: "14px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
  },
};

function StatusChip({ text, background, color = "#0f172a" }) {
  return (
    <span
      style={{
        ...styles.chip,
        background,
        color,
      }}
    >
      {text}
    </span>
  );
}

function App() {
  const [personName, setPersonName] = useState("");
  const [people, setPeople] = useState([]);

  const [friendshipSource, setFriendshipSource] = useState("");
  const [friendshipTarget, setFriendshipTarget] = useState("");
  const [friendships, setFriendships] = useState([]);

  const [startPerson, setStartPerson] = useState("");
  const [targetPerson, setTargetPerson] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");

  const steps = result?.steps || [];
  const currentStep = steps.length
    ? steps[Math.min(currentStepIndex, steps.length - 1)]
    : null;

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((previous) => previous + 1);
    }, 1300);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps]);

  useEffect(() => {
    if (selectedNode && !people.includes(selectedNode)) {
      setSelectedNode("");
    }
  }, [people, selectedNode]);

  const nodePositions = useMemo(() => {
    const width = 960;
    const height = 620;
    const total = people.length;
    const positions = {};

    if (total === 0) return positions;

    if (total === 1) {
      positions[people[0]] = { x: width / 2, y: height / 2 };
      return positions;
    }

    if (total === 2) {
      positions[people[0]] = { x: width * 0.33, y: height / 2 };
      positions[people[1]] = { x: width * 0.67, y: height / 2 };
      return positions;
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.36;

    people.forEach((name, index) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
      positions[name] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });

    return positions;
  }, [people]);

  const nodeHistory = useMemo(() => {
    const info = {};

    people.forEach((name) => {
      info[name] = {
        discoveredAt: null,
        discoveredFrom: null,
        processedAt: null,
      };
    });

    if (result?.start && info[result.start]) {
      info[result.start].discoveredAt = 0;
      info[result.start].discoveredFrom = "start";
    }

    steps.slice(0, currentStepIndex + 1).forEach((step, index) => {
      const stepNo = index + 1;

      if (info[step.current] && info[step.current].processedAt === null) {
        info[step.current].processedAt = stepNo;
      }

      (step.newly_discovered || []).forEach((name) => {
        if (info[name] && info[name].discoveredAt === null) {
          info[name].discoveredAt = stepNo;
          info[name].discoveredFrom = step.current;
        }
      });
    });

    return info;
  }, [people, result, steps, currentStepIndex]);

  function resetSimulationState() {
    setResult(null);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedNode("");
  }

  function addPerson(event) {
    event.preventDefault();
    setErrorMessage("");

    const cleaned = personName.trim();
    if (!cleaned) {
      setErrorMessage("Enter a person name.");
      return;
    }

    const exists = people.some(
      (person) => person.toLowerCase() === cleaned.toLowerCase(),
    );

    if (exists) {
      setErrorMessage("That person already exists.");
      return;
    }

    const updatedPeople = [...people, cleaned];
    setPeople(updatedPeople);
    setPersonName("");

    if (!startPerson) setStartPerson(cleaned);
    if (!targetPerson) setTargetPerson(cleaned);
    if (!friendshipSource) setFriendshipSource(cleaned);
    if (!friendshipTarget) setFriendshipTarget(cleaned);

    resetSimulationState();
  }

  function removePerson(nameToRemove) {
    const updatedPeople = people.filter((name) => name !== nameToRemove);
    const updatedFriendships = friendships.filter(
      (edge) => edge.source !== nameToRemove && edge.target !== nameToRemove,
    );

    setPeople(updatedPeople);
    setFriendships(updatedFriendships);

    if (startPerson === nameToRemove) {
      setStartPerson(updatedPeople[0] || "");
    }

    if (targetPerson === nameToRemove) {
      setTargetPerson(updatedPeople[0] || "");
    }

    if (friendshipSource === nameToRemove) {
      setFriendshipSource(updatedPeople[0] || "");
    }

    if (friendshipTarget === nameToRemove) {
      setFriendshipTarget(updatedPeople[0] || "");
    }

    resetSimulationState();
  }

  function addFriendship(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!friendshipSource || !friendshipTarget) {
      setErrorMessage("Choose two people.");
      return;
    }

    if (friendshipSource === friendshipTarget) {
      setErrorMessage("Choose two different people.");
      return;
    }

    const exists = friendships.some((edge) => {
      return (
        (edge.source === friendshipSource &&
          edge.target === friendshipTarget) ||
        (edge.source === friendshipTarget && edge.target === friendshipSource)
      );
    });

    if (exists) {
      setErrorMessage("That friendship already exists.");
      return;
    }

    setFriendships((previous) => [
      ...previous,
      { source: friendshipSource, target: friendshipTarget },
    ]);

    resetSimulationState();
  }

  function removeFriendship(edgeToRemove) {
    setFriendships((previous) =>
      previous.filter(
        (edge) =>
          !(
            edge.source === edgeToRemove.source &&
            edge.target === edgeToRemove.target
          ),
      ),
    );
    resetSimulationState();
  }

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

  async function runBfs() {
    setErrorMessage("");

    if (people.length < 2) {
      setErrorMessage("Add at least two people.");
      return;
    }

    if (!friendships.length) {
      setErrorMessage("Add at least one friendship.");
      return;
    }

    if (!startPerson || !targetPerson) {
      setErrorMessage("Choose both start and target.");
      return;
    }

    setLoading(true);
    setIsPlaying(false);

    try {
      const data = await callApi("/api/find-connection", {
        method: "POST",
        body: JSON.stringify({
          people,
          friendships,
          start: startPerson,
          target: targetPerson,
        }),
      });

      setResult(data);
      setCurrentStepIndex(0);
      setSelectedNode(data.start || "");
    } catch (error) {
      setResult(null);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setPeople([]);
    setFriendships([]);
    setStartPerson("");
    setTargetPerson("");
    setFriendshipSource("");
    setFriendshipTarget("");
    setPersonName("");
    setErrorMessage("");
    resetSimulationState();
  }

  function restartPlayback() {
    if (!steps.length) return;
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  function goPrev() {
    setIsPlaying(false);
    setCurrentStepIndex((previous) => Math.max(previous - 1, 0));
  }

  function goNext() {
    setIsPlaying(false);
    setCurrentStepIndex((previous) =>
      Math.min(previous + 1, Math.max(steps.length - 1, 0)),
    );
  }

  function togglePlay() {
    if (!steps.length) return;

    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((previous) => !previous);
  }

  function getNodeState(name) {
    const isStart = result ? result.start === name : startPerson === name;
    const isTarget = result ? result.target === name : targetPerson === name;
    const isCurrent = currentStep?.current === name;
    const discoveredThisStep = currentStep?.newly_discovered?.includes(name);
    const isVisited = currentStep?.visited_after?.includes(name) || false;
    const onFinalPath =
      currentStep?.target_found && currentStep?.path_so_far?.includes(name);

    let fill = "#ffffff";
    let stroke = "#94a3b8";
    let strokeWidth = 2.5;

    if (isVisited) {
      fill = "#dbeafe";
      stroke = "#3b82f6";
    }

    if (discoveredThisStep) {
      fill = "#fef3c7";
      stroke = "#f59e0b";
    }

    if (onFinalPath) {
      fill = "#ede9fe";
      stroke = "#7c3aed";
      strokeWidth = 3.5;
    }

    if (isCurrent) {
      fill = "#ffedd5";
      stroke = "#d97706";
      strokeWidth = 3.5;
    }

    if (isStart) {
      stroke = "#16a34a";
      strokeWidth = Math.max(strokeWidth, 3.5);
    }

    if (isTarget) {
      stroke = "#dc2626";
      strokeWidth = Math.max(strokeWidth, 3.5);
    }

    return {
      isStart,
      isTarget,
      isCurrent,
      discoveredThisStep,
      isVisited,
      onFinalPath,
      fill,
      stroke,
      strokeWidth,
    };
  }

  function isPathEdge(a, b) {
    if (!currentStep?.target_found || !currentStep?.path_so_far?.length)
      return false;
    const path = currentStep.path_so_far;

    for (let i = 0; i < path.length - 1; i += 1) {
      const first = path[i];
      const second = path[i + 1];
      if ((first === a && second === b) || (first === b && second === a)) {
        return true;
      }
    }

    return false;
  }

  function isDiscoveryEdge(a, b) {
    if (!currentStep) return false;
    return (
      (currentStep.current === a &&
        currentStep.newly_discovered?.includes(b)) ||
      (currentStep.current === b && currentStep.newly_discovered?.includes(a))
    );
  }

  const selectedNodeInfo = selectedNode ? nodeHistory[selectedNode] : null;
  const selectedNodeNeighbors = result?.adjacency_list?.[selectedNode] || [];

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.badge}>INF1008 BFS visualisation</div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "2rem" }}>
            Social Connection Finder
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
            Build a friendship graph, choose a start and target, then watch BFS
            move level by level through the network.
          </p>
        </section>

        <div style={styles.grid}>
          <aside style={{ ...styles.card, ...styles.sidebar }}>
            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>People</div>
              <form onSubmit={addPerson}>
                <label style={styles.label}>
                  Person name
                  <input
                    style={styles.input}
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder="e.g. Alice"
                  />
                </label>
                <button type="submit" style={styles.buttonPrimary}>
                  Add person
                </button>
              </form>

              <div style={{ ...styles.softBlock, marginTop: "12px" }}>
                {people.length === 0 ? (
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    No people added.
                  </div>
                ) : (
                  people.map((name) => (
                    <div key={name} style={styles.listItem}>
                      <strong>{name}</strong>
                      <button
                        type="button"
                        style={styles.buttonGhost}
                        onClick={() => removePerson(name)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>Friendships</div>
              <form onSubmit={addFriendship}>
                <label style={styles.label}>
                  Person A
                  <select
                    style={styles.input}
                    value={friendshipSource}
                    onChange={(event) =>
                      setFriendshipSource(event.target.value)
                    }
                  >
                    <option value="">Choose</option>
                    {people.map((name) => (
                      <option key={`source-${name}`} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={styles.label}>
                  Person B
                  <select
                    style={styles.input}
                    value={friendshipTarget}
                    onChange={(event) =>
                      setFriendshipTarget(event.target.value)
                    }
                  >
                    <option value="">Choose</option>
                    {people.map((name) => (
                      <option key={`target-${name}`} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <button type="submit" style={styles.buttonSecondary}>
                  Add friendship
                </button>
              </form>

              <div style={{ ...styles.softBlock, marginTop: "12px" }}>
                {friendships.length === 0 ? (
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    No friendships added.
                  </div>
                ) : (
                  friendships.map((edge) => (
                    <div
                      key={`${edge.source}-${edge.target}`}
                      style={styles.listItem}
                    >
                      <strong>
                        {edge.source} ↔ {edge.target}
                      </strong>
                      <button
                        type="button"
                        style={styles.buttonGhost}
                        onClick={() => removeFriendship(edge)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <div style={styles.sectionTitle}>Search</div>
              <label style={styles.label}>
                Start person
                <select
                  style={styles.input}
                  value={startPerson}
                  onChange={(event) => setStartPerson(event.target.value)}
                >
                  <option value="">Choose</option>
                  {people.map((name) => (
                    <option key={`start-${name}`} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                Target person
                <select
                  style={styles.input}
                  value={targetPerson}
                  onChange={(event) => setTargetPerson(event.target.value)}
                >
                  <option value="">Choose</option>
                  {people.map((name) => (
                    <option key={`end-${name}`} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ ...styles.controlsRow, marginBottom: 0 }}>
                <button
                  type="button"
                  style={styles.buttonPrimary}
                  onClick={runBfs}
                  disabled={loading}
                >
                  {loading ? "Running..." : "Run BFS"}
                </button>
                <button
                  type="button"
                  style={styles.buttonSecondary}
                  onClick={resetAll}
                >
                  Reset all
                </button>
              </div>
            </div>

            {errorMessage ? (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  borderRadius: "14px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fecaca",
                  fontWeight: 700,
                }}
              >
                {errorMessage}
              </div>
            ) : null}
          </aside>

          <main style={{ ...styles.card, ...styles.main }}>
            <div style={styles.controlsRow}>
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={restartPlayback}
              >
                Restart
              </button>
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={goPrev}
              >
                Prev
              </button>
              <button
                type="button"
                style={styles.buttonPrimary}
                onClick={togglePlay}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                style={styles.buttonSecondary}
                onClick={goNext}
              >
                Next
              </button>
              <div
                style={{
                  marginLeft: "auto",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {steps.length
                  ? `Step ${currentStepIndex + 1} / ${steps.length}`
                  : "Build a graph and run BFS"}
              </div>
            </div>

            <div style={styles.legendRow}>
              <span>
                <span style={{ ...styles.legendDot, background: "#16a34a" }} />
                start
              </span>
              <span>
                <span style={{ ...styles.legendDot, background: "#dc2626" }} />
                target
              </span>
              <span>
                <span style={{ ...styles.legendDot, background: "#d97706" }} />
                current
              </span>
              <span>
                <span style={{ ...styles.legendDot, background: "#3b82f6" }} />
                visited
              </span>
              <span>
                <span style={{ ...styles.legendDot, background: "#7c3aed" }} />
                shortest path
              </span>
            </div>

            <div style={styles.visualWrap}>
              <div
                style={{
                  ...styles.overlay,
                  top: 14,
                  left: 14,
                  padding: "10px 12px",
                  minWidth: 210,
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#64748b",
                    fontWeight: 800,
                    marginBottom: "6px",
                  }}
                >
                  Queue
                </div>
                <div style={styles.chipRow}>
                  {currentStep?.queue_before?.length ? (
                    currentStep.queue_before.map((name) => (
                      <StatusChip
                        key={name}
                        text={name}
                        background="#dbeafe"
                        color="#1e3a8a"
                      />
                    ))
                  ) : (
                    <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      —
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  ...styles.overlay,
                  top: 14,
                  right: 14,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#64748b",
                    fontWeight: 800,
                    marginBottom: "6px",
                  }}
                >
                  Current action
                </div>
                {currentStep ? (
                  <>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: "1rem",
                        marginBottom: "6px",
                      }}
                    >
                      Process {currentStep.current}
                    </div>
                    <div style={styles.chipRow}>
                      {(currentStep.newly_discovered || []).length ? (
                        currentStep.newly_discovered.map((name) => (
                          <StatusChip
                            key={name}
                            text={name}
                            background="#fef3c7"
                            color="#92400e"
                          />
                        ))
                      ) : (
                        <StatusChip
                          text="no new nodes"
                          background="#eef2f7"
                          color="#475569"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Run BFS to start
                  </div>
                )}
              </div>

              {currentStep?.target_found ? (
                <div
                  style={{
                    ...styles.overlay,
                    right: 14,
                    bottom: 14,
                    padding: "10px 12px",
                    maxWidth: 360,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      fontWeight: 800,
                      marginBottom: "6px",
                    }}
                  >
                    Shortest path found
                  </div>
                  <div style={{ fontWeight: 900, fontSize: "1rem" }}>
                    {currentStep.path_so_far.join(" → ")}
                  </div>
                  <div style={{ color: "#64748b", marginTop: "4px" }}>
                    {Math.max(currentStep.path_so_far.length - 1, 0)} hop(s)
                  </div>
                </div>
              ) : null}

              {selectedNode && nodePositions[selectedNode] ? (
                <div
                  style={{
                    ...styles.overlay,
                    left: Math.max(16, nodePositions[selectedNode].x - 90),
                    top: Math.max(82, nodePositions[selectedNode].y + 34),
                    padding: "10px 12px",
                    width: 190,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <strong>{selectedNode}</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedNode("")}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#64748b",
                        fontWeight: 800,
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#475569",
                      marginTop: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedNode === result?.start
                      ? "Start node"
                      : selectedNode === result?.target
                        ? "Target node"
                        : "Node"}
                    <br />
                    Neighbors:{" "}
                    {selectedNodeNeighbors.length
                      ? selectedNodeNeighbors.join(", ")
                      : "none"}
                    <br />
                    Discovered:{" "}
                    {selectedNodeInfo?.discoveredAt === null
                      ? "not yet"
                      : selectedNodeInfo.discoveredAt === 0
                        ? "start"
                        : `step ${selectedNodeInfo.discoveredAt}`}
                    <br />
                    From: {selectedNodeInfo?.discoveredFrom || "—"}
                    <br />
                    Processed:{" "}
                    {selectedNodeInfo?.processedAt
                      ? `step ${selectedNodeInfo.processedAt}`
                      : "not yet"}
                  </div>
                </div>
              ) : null}

              <svg
                viewBox="0 0 960 620"
                style={{ display: "block", width: "100%", height: 620 }}
              >
                {friendships.map((edge) => {
                  const start = nodePositions[edge.source];
                  const end = nodePositions[edge.target];

                  if (!start || !end) return null;

                  let stroke = "#cbd5e1";
                  let strokeWidth = 3;
                  let dasharray = "0";

                  if (isDiscoveryEdge(edge.source, edge.target)) {
                    stroke = "#f59e0b";
                    strokeWidth = 5;
                    dasharray = "8 6";
                  }

                  if (isPathEdge(edge.source, edge.target)) {
                    stroke = "#7c3aed";
                    strokeWidth = 6;
                    dasharray = "0";
                  }

                  return (
                    <line
                      key={`${edge.source}-${edge.target}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dasharray}
                      strokeLinecap="round"
                    />
                  );
                })}

                {people.map((name) => {
                  const position = nodePositions[name];
                  if (!position) return null;

                  const state = getNodeState(name);

                  return (
                    <g
                      key={name}
                      onClick={() => setSelectedNode(name)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="27"
                        fill={state.fill}
                        stroke={state.stroke}
                        strokeWidth={state.strokeWidth}
                      />
                      <text
                        x={position.x}
                        y={position.y + 5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="800"
                        fill="#0f172a"
                      >
                        {name.length > 12 ? `${name.slice(0, 10)}…` : name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ ...styles.controlsRow, marginTop: "12px" }}>
              <div style={{ color: "#475569", fontWeight: 700 }}>
                {currentStep
                  ? currentStep.target_found
                    ? `Target reached at step ${currentStep.step}`
                    : `Visited: ${(currentStep.visited_after || []).join(", ")}`
                  : "Click a node to see its details."}
              </div>
            </div>

            {steps.length ? (
              <div style={styles.stepDots}>
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isReached = index < currentStepIndex;
                  return (
                    <button
                      key={step.step}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIndex(index);
                      }}
                      title={`Step ${step.step}: ${step.current}`}
                      style={{
                        ...styles.timelineDot,
                        background: isActive
                          ? "#2563eb"
                          : step.target_found
                            ? "#7c3aed"
                            : isReached
                              ? "#93c5fd"
                              : "#dbe4f0",
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
