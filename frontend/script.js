const API = '/api/items';
const input = document.getElementById('itemInput');
const list = document.getElementById('itemList');
document.getElementById('addBtn').onclick = addItem;

async function fetchItems(){
  const res = await fetch(API);
  const data = await res.json();
  list.innerHTML = '';
  data.forEach(i=>{
    const li = document.createElement('li');
    li.innerHTML = `${i.name}
      <button onclick="editItem(${i.id}, '${escapeHtml(i.name)}')">Edit</button>
      <button onclick="deleteItem(${i.id})">Delete</button>`;
    list.appendChild(li);
  });
}
async function addItem(){
  const name = input.value.trim(); if(!name) return;
  await fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name})});
  input.value=''; fetchItems();
}
async function editItem(id, oldName){
  const newName = prompt('Edit item:', oldName);
  if(!newName) return;
  await fetch(`${API}/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name:newName})});
  fetchItems();
}
async function deleteItem(id){
  await fetch(`${API}/${id}`, {method:'DELETE'});
  fetchItems();
}
function escapeHtml(s){ return s.replace(/'/g, "\\'").replace(/"/g,'\\"'); }
fetchItems();
