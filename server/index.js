const express = require("express");
const promBundle = require("express-prom-bundle");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const port = 8080;
const DATA_FILE = path.join(__dirname, "board-data.json");

app.use(cors());
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeDefaultMetrics: true,
  customLabels: { app: "kanban-board" },
});
app.use(metricsMiddleware);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- All your API Endpoints for the Kanban Board ---
app.get("/api/board", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    const defaultBoard = {
      columns: [
        { id: 1, title: "To Do" },
        { id: 2, title: "In Progress" },
        { id: 3, title: "Done" },
      ],
      cards: [],
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultBoard, null, 2));
    res.json(defaultBoard);
  }
});
app.post("/api/cards", async (req, res) => {
  /* ... full code ... */
});
app.put("/api/cards/:id", async (req, res) => {
  /* ... full code ... */
});
app.delete("/api/cards/:id", async (req, res) => {
  /* ... full code ... */
});

// --- Catch-all to serve the React App ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(
    `🚀 Professional Kanban Board running at http://localhost:${port}`
  );
});
