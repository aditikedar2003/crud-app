const API = "/api/items"; // relative path works with Express
const input = document.getElementById("itemInput");
const list = document.getElementById("itemList");
const addBtn = document.getElementById("addBtn");

addBtn.onclick = addItem;

async function fetchItems() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    list.innerHTML = "";
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name}
        <button onclick="editItem(${item.id}, '${escapeHtml(item.name)}')">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch items:", err);
  }
}

async function addItem() {
  const name = input.value.trim();
  if (!name) return;
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  input.value = "";
  fetchItems();
}

async function editItem(id, oldName) {
  const newName = prompt("Edit item:", oldName);
  if (!newName) return;
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName })
  });
  fetchItems();
}

async function deleteItem(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchItems();
}

// Escape quotes to prevent JS errors
function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Fetch items on page load
fetchItems();
