# BFS Friend Finder 🌐👥

An interactive web application that visualises how the **Breadth-First Search (BFS)** algorithm discovers the shortest connection path between people in a social network graph.

Built with **React** + **FastAPI** for educational algorithm visualisation.

Link to Backend Repo: [https://github.com/irfan-imran/INF1008-Assignment2-Backend](https://github.com/irfan-imran/INF1008-Assignment2-Backend)

---

## ✅ Features

* 👥 Create people and friendship connections
* 🌐 Dynamic graph visualisation
* 🔍 BFS shortest-path discovery
* 📦 Queue state tracking during traversal
* 🧭 Step-by-step BFS simulation
* 🎯 Final shortest-path reconstruction
* ▶️ Playback controls (Play, Pause, Next, Previous, Restart)
* 📚 Beginner-friendly algorithm explanations

---

## 🛠️ Tech Stack

* **Frontend:** React
* **Backend:** FastAPI + Python
* **Algorithm:** Breadth-First Search (BFS)
* **Data Structure:** Graph (Adjacency List)

---

## 🧠 BFS Concepts Demonstrated

| Concept          | Description                         |
| ---------------- | ----------------------------------- |
| Queue Traversal  | Demonstrates FIFO exploration order |
| Visited Nodes    | Tracks explored vertices            |
| Discovered Nodes | Shows newly discovered connections  |
| Parent Tracking  | Reconstructs shortest path          |
| Shortest Path    | Finds minimum-hop connection        |

---

## 🚀 Running the Frontend

Clone the repository:

```bash id="f1"
git clone <your-frontend-repo-url>
```

Navigate into the project folder:

```bash id="f2"
cd bfs-friend-finder-frontend
```

Install dependencies:

```bash id="f3"
npm install
```

Start the development server:

```bash id="f4"
npm start
```

The frontend will run on:

```bash id="f5"
http://localhost:3000
```

---

## 🔗 Backend Requirement

This frontend requires the FastAPI backend server to be running.

Example backend endpoint:

```bash id="f6"
http://localhost:8000/api/find-connection
```

---

## 📸 Screenshots of the Web App

The screenshots below showcase the BFS traversal visualisation and overall application flow.
<img width="704" height="350" alt="Screenshot 2026-05-12 080818" src="https://github.com/user-attachments/assets/be4e2cb3-76eb-4697-8947-e2ffb06352ce" />

<!-- <table>
  <tr>
    <td align="center">
      <img src="./docs/home.png" width="350"/><br/>
      Home Screen
    </td>
    <td align="center">
      <img src="./docs/graph.png" width="350"/><br/>
      Graph Visualisation
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="./docs/bfs-step.png" width="350"/><br/>
      BFS Traversal Step
    </td>
    <td align="center">
      <img src="./docs/path-result.png" width="350"/><br/>
      Shortest Path Result
    </td>
  </tr>
</table> -->

---

## 🎓 Educational Purpose

This project was developed as part of a Data Structures and Algorithms assignment focused on evaluating and demonstrating the practical application of the Breadth-First Search (BFS) algorithm. 

---

## 🔮 Future Improvements

* 🎞️ Animated traversal transitions
* ⚖️ Weighted graph support
* 🛣️ Dijkstra shortest-path visualisation
* 🌙 Dark mode support
* 📱 Improved mobile responsiveness
* 💾 Save and load graph datasets

---

## 👨‍💻 Team Contributions

| Name        | Role               | Responsibilities                             |
| ----------- | ------------------ | -------------------------------------------- |
| Irfan       | Frontend Developer | React UI, BFS visualisation, playback system |
| Team Members | Backend Developer  | FastAPI API and graph traversal logic        |

---
