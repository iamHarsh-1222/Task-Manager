const API = 'https://team-task-manager-two-bice.vercel.app/api'; // UPDATE AFTER DEPLOY

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
if (!token) window.location.href = 'index.html';

document.getElementById('userBadge').textContent = `${user.name} · ${user.role}`;
if (user.role === 'Admin') document.getElementById('newProjectBtn').classList.remove('hidden');

let allUsers = [];

async function loadDashboard() {
  await loadUsers();
  await loadProjects();
  await loadMyTasks();
}

async function loadUsers() {
  const res = await fetch(`${API}/auth/users`, { headers: { Authorization: `Bearer ${token}` } });
  allUsers = await res.json();
}

async function loadProjects() {
  const res = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
  const projects = await res.json();
  const grid = document.getElementById('projectsGrid');

  document.getElementById('statProjects').textContent = projects.length;

  if (!projects.length) {
    grid.innerHTML = '<p class="loading">No projects yet. ' + (user.role === 'Admin' ? 'Create one!' : 'Wait to be added to one.') + '</p>';
    return;
  }

  // Load tasks for stats
  let totalTasks = 0, overdue = 0, done = 0;
  grid.innerHTML = projects.map(p => `
    <a class="project-card" href="project.html?id=${p._id}">
      <h3>${p.name}</h3>
      <p>${p.description || 'No description'}</p>
      <div class="project-meta">
        <span>👥 ${p.members.length} members</span>
        <span>👤 ${p.owner.name}</span>
      </div>
    </a>
  `).join('');

  // Fetch tasks for all projects for stats
  for (const p of projects) {
    const tr = await fetch(`${API}/tasks/project/${p._id}`, { headers: { Authorization: `Bearer ${token}` } });
    const tasks = await tr.json();
    totalTasks += tasks.length;
    done += tasks.filter(t => t.status === 'Done').length;
    overdue += tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  }
  document.getElementById('statTasks').textContent = totalTasks;
  document.getElementById('statDone').textContent = done;
  document.getElementById('statOverdue').textContent = overdue;
}

async function loadMyTasks() {
  const res = await fetch(`${API}/tasks/my`, { headers: { Authorization: `Bearer ${token}` } });
  const tasks = await res.json();
  const list = document.getElementById('myTasksList');
  if (!tasks.length) { list.innerHTML = '<p class="loading">No tasks assigned to you.</p>'; return; }
  list.innerHTML = tasks.map(t => `
    <div class="task-list-item">
      <div>
        <div class="task-name">${t.title}</div>
        <div class="task-project">📁 ${t.project?.name || 'Unknown'}</div>
      </div>
      <span class="priority-badge ${t.priority}">${t.priority}</span>
    </div>
  `).join('');
}

function showMyTasks() {
  document.getElementById('myTasksSection').classList.toggle('hidden');
}

function openProjectModal() {
  const list = document.getElementById('membersList');
  list.innerHTML = allUsers.filter(u => u._id !== user.id).map(u => `
    <label class="member-check">
      <input type="checkbox" value="${u._id}"/>
      ${u.name} (${u.role})
    </label>
  `).join('');
  document.getElementById('projectModal').classList.remove('hidden');
}

async function createProject(e) {
  e.preventDefault();
  const name = document.getElementById('projName').value;
  const description = document.getElementById('projDesc').value;
  const members = [...document.querySelectorAll('#membersList input:checked')].map(i => i.value);
  const res = await fetch(`${API}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description, members })
  });
  if (res.ok) { closeModal('projectModal'); loadProjects(); }
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function logout() { localStorage.clear(); window.location.href = 'index.html'; }

loadDashboard();