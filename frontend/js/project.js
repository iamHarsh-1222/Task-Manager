const API = 'https://team-task-manager-two-bice.vercel.app/api'; // UPDATE AFTER DEPLOY

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (!token) window.location.href = 'index.html';

const projectId = new URLSearchParams(window.location.search).get('id');
if (!projectId) window.location.href = 'dashboard.html';

document.getElementById('userBadge').textContent = `${user.name} · ${user.role}`;

let projectMembers = [];

async function loadProject() {
  const res = await fetch(`${API}/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
  const project = await res.json();
  document.getElementById('projectTitle').textContent = project.name;
  document.getElementById('projectDesc').textContent = project.description || '';
  projectMembers = [project.owner, ...project.members];

  // Populate assign dropdown
  const sel = document.getElementById('taskAssign');
  projectMembers.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m._id; opt.textContent = m.name;
    sel.appendChild(opt);
  });

  loadTasks();
}

async function loadTasks() {
  const res = await fetch(`${API}/tasks/project/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
  const tasks = await res.json();

  ['Todo', 'In Progress', 'Done'].forEach(status => {
    document.getElementById(`col-${status}`).innerHTML = '';
  });

  tasks.forEach(t => {
    const due = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date';
    const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done';
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <span class="priority-badge ${t.priority}">${t.priority}</span>
      <h4>${t.title}</h4>
      <div class="task-meta">👤 ${t.assignedTo?.name || 'Unassigned'}</div>
      <div class="task-meta" style="color:${overdue ? '#ff5b8a' : ''}">📅 ${due}</div>
    `;
    card.onclick = () => openEditModal(t);
    document.getElementById(`col-${t.status}`).appendChild(card);
  });
}

function openTaskModal() {
  document.getElementById('taskModal').classList.remove('hidden');
}

async function createTask(e) {
  e.preventDefault();
  const body = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDesc').value,
    assignedTo: document.getElementById('taskAssign').value || null,
    priority: document.getElementById('taskPriority').value,
    dueDate: document.getElementById('taskDue').value || null,
    project: projectId
  };
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  if (res.ok) { closeModal('taskModal'); loadTasks(); }
}

function openEditModal(task) {
  document.getElementById('editTaskId').value = task._id;
  document.getElementById('editTaskStatus').value = task.status;
  document.getElementById('editTaskPriority').value = task.priority;
  if (user.role === 'Admin') document.getElementById('deleteTaskBtn').style.display = 'inline-block';
  document.getElementById('editTaskModal').classList.remove('hidden');
}

async function updateTask() {
  const id = document.getElementById('editTaskId').value;
  const status = document.getElementById('editTaskStatus').value;
  const priority = document.getElementById('editTaskPriority').value;
  await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, priority })
  });
  closeModal('editTaskModal');
  loadTasks();
}

async function deleteTask() {
  const id = document.getElementById('editTaskId').value;
  await fetch(`${API}/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  closeModal('editTaskModal');
  loadTasks();
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function logout() { localStorage.clear(); window.location.href = 'index.html'; }

loadProject();