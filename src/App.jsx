import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
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
    border: "1px solid #dbe4f0",
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
    gridTemplateColumns: "320px 1fr",
    gap: "18px",
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
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
    background: "rgba(255,255,255,0.94)",
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
  statusBar: {
    marginTop: "12px",
    padding: "12px 14px",
    borderRadius: "16px",
    border: "1px solid #dbe4f0",
    background: "#f8fbff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
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

    const discoveredOrder = result?.discovered_order || [];
    discoveredOrder.forEach((name) => {
      const firstDiscoveryStep = steps.findIndex((step) =>
        (step.newly_discovered || []).includes(name),
      );

      if (info[name] && firstDiscoveryStep !== -1) {
        info[name].discoveredAt = firstDiscoveryStep + 1;
        info[name].discoveredFrom = steps[firstDiscoveryStep].current;
      }
    });

    const processedOrder = result?.processed_order || [];
    processedOrder.forEach((name, index) => {
      if (info[name]) {
        info[name].processedAt = index + 1;
      }
    });

    return info;
  }, [people, result, steps]);

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

    if (startPerson === nameToRemove) setStartPerson(updatedPeople[0] || "");
    if (targetPerson === nameToRemove) setTargetPerson(updatedPeople[0] || "");
    if (friendshipSource === nameToRemove)
      setFriendshipSource(updatedPeople[0] || "");
    if (friendshipTarget === nameToRemove)
      setFriendshipTarget(updatedPeople[0] || "");

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

    if (!startPerson || !targetPerson) {
      setErrorMessage("Choose both start and target.");
      return;
    }

    if (people.length < 1) {
      setErrorMessage("Add at least one person.");
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
    const isDiscovered = currentStep?.visited_after?.includes(name) || false;
    const isProcessed = currentStep
      ? (result?.processed_order || [])
          .slice(0, currentStepIndex + 1)
          .includes(name)
      : false;
    const onFinalPath =
      currentStep?.target_found && currentStep?.path_so_far?.includes(name);

    let fill = "#ffffff";
    let stroke = "#94a3b8";
    let strokeWidth = 2.5;

    if (isDiscovered) {
      fill = "#dbeafe";
      stroke = "#3b82f6";
    }

    if (isProcessed) {
      fill = "#bfdbfe";
      stroke = "#2563eb";
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
  const adjacencyList = result?.adjacency_list || {};
  const selectedNodeNeighbors = adjacencyList[selectedNode] || [];
  const summaryText = useMemo(() => {
    if (!result) return "Build a graph and run BFS.";
    if (result.result_type === "same-person") {
      return `${result.start} is already the target.`;
    }
    if (result.found) {
      return `${result.path.join(" → ")} (${result.hop_count} hop${
        result.hop_count === 1 ? "" : "s"
      })`;
    }
    return `No connection path from ${result.start} to ${result.target}.`;
  }, [result]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.badge}>INF1008 BFS visualisation</div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "2rem" }}>
            Social Connection Finder
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
            Build your graph, pick a start and target, then watch BFS discover
            people level by level.
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
                discovered
              </span>
              <span>
                <span style={{ ...styles.legendDot, background: "#2563eb" }} />
                processed
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
                  Queue before processing
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
                  minWidth: 250,
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
                  Current step
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
                      {currentStep.explanation}
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

              {selectedNode && nodePositions[selectedNode] ? (
                <div
                  style={{
                    ...styles.overlay,
                    left: Math.max(16, nodePositions[selectedNode].x - 95),
                    top: Math.max(82, nodePositions[selectedNode].y + 34),
                    padding: "10px 12px",
                    width: 210,
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

            <div style={styles.statusBar}>
              <div>
                <div style={{ fontWeight: 900, marginBottom: 4 }}>Result</div>
                <div style={{ color: "#475569" }}>{summaryText}</div>
              </div>
              {result ? (
                <div style={styles.chipRow}>
                  <StatusChip
                    text={`Discovered: ${(result.discovered_order || []).join(" → ") || "—"}`}
                    background="#eef2ff"
                    color="#4338ca"
                  />
                  <StatusChip
                    text={`Processed: ${(result.processed_order || []).join(" → ") || "—"}`}
                    background="#eff6ff"
                    color="#1d4ed8"
                  />
                </div>
              ) : null}
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
