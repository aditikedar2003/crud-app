const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Render will set PORT

app.use(express.json());

// Path to data.json
const dataFile = path.join(__dirname, "data.json");

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Read all items
app.get("/api/items", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Create new item
app.post("/api/items", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(newItem);
});

// Update item
app.put("/api/items/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const id = parseInt(req.params.id);
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Delete item
app.delete("/api/items/:id", (req, res) => {
  let data = JSON.parse(fs.readFileSync(dataFile));
  const id = parseInt(req.params.id);
  data = data.filter(item => item.id !== id);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json({ message: "Item deleted" });
});

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
