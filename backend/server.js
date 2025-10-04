const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());

// serve frontend static files
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

// simple helpers
function readData(){ try{ return JSON.parse(fs.readFileSync(DATA_FILE)); }catch(e){ return []; } }
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

// API - relative path /api/items
app.get('/api/items', (req, res) => res.json(readData()));
app.post('/api/items', (req, res) => {
  const data = readData();
  const item = { id: Date.now(), name: req.body.name || 'Untitled' };
  data.push(item); writeData(data); res.json(item);
});
app.put('/api/items/:id', (req, res) => {
  let data = readData();
  const id = Number(req.params.id);
  data = data.map(it => it.id === id ? { ...it, name: req.body.name } : it);
  writeData(data); res.json({ message: 'updated' });
});
app.delete('/api/items/:id', (req, res) => {
  let data = readData();
  const id = Number(req.params.id);
  data = data.filter(it => it.id !== id);
  writeData(data); res.json({ message: 'deleted' });
});

// any other route, serve index.html (for single page)
app.get('*', (req, res) => res.sendFile(path.join(frontendDir, 'index.html')));

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
