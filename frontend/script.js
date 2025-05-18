const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "It always seems impossible until it's done.",
  "Dream big and dare to fail.",
  "You don't have to be great to start, but you have to start to be great."
];

function showRandomQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('quote').textContent = quote;
}

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function renderCounters() {
  const counters = document.getElementById('counters');
  counters.textContent = `Active: ${tasks.length} | Completed: ${completedTasks.length}`;
}

function renderTasks() {
  const ul = document.getElementById('taskList');
  ul.innerHTML = '';
  const now = new Date();
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = '';
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.dueDate) {
      const due = document.createElement('span');
      due.className = 'due-date';
      due.textContent = `Due: ${task.dueDate}`;
      if (new Date(task.dueDate) < now.setHours(0,0,0,0)) {
        li.classList.add('overdue');
        due.textContent += ' (Overdue)';
      }
      span.appendChild(due);
    }
    li.appendChild(span);
    const actions = document.createElement('span');
    actions.className = 'actions';
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'complete-btn';
    editBtn.onclick = () => editTask(idx, li);
    actions.appendChild(editBtn);
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✓';
    completeBtn.className = 'complete-btn';
    completeBtn.onclick = () => completeTask(idx);
    actions.appendChild(completeBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deleteTask(idx);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);
    ul.appendChild(li);
  });

  const cul = document.getElementById('completedList');
  cul.innerHTML = '';
  completedTasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.className = 'completed';
    if (task.dueDate) {
      const due = document.createElement('span');
      due.className = 'due-date';
      due.textContent = `Due: ${task.dueDate}`;
      li.appendChild(due);
    }
    const actions = document.createElement('span');
    actions.className = 'actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => deleteCompletedTask(idx);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);
    cul.appendChild(li);
  });
  renderCounters();
}

function addTask() {
  const input = document.getElementById('taskInput');
  const dueInput = document.getElementById('dueDateInput');
  const text = input.value.trim();
  const dueDate = dueInput.value;
  if (text) {
    tasks.push({ text, dueDate });
    input.value = '';
    dueInput.value = '';
    saveTasks();
    renderTasks();
  }
}

function removeWithAnimation(listElement, idx, callback) {
  const li = listElement.children[idx];
  if (!li) { callback(); return; }
  li.classList.add('removing');
  setTimeout(callback, 200);
}

function completeTask(idx) {
  const ul = document.getElementById('taskList');
  removeWithAnimation(ul, idx, () => {
    completedTasks.push(tasks[idx]);
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
  });
}

function deleteTask(idx) {
  const ul = document.getElementById('taskList');
  removeWithAnimation(ul, idx, () => {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
  });
}

function deleteCompletedTask(idx) {
  const cul = document.getElementById('completedList');
  removeWithAnimation(cul, idx, () => {
    completedTasks.splice(idx, 1);
    saveTasks();
    renderTasks();
  });
}

function clearCompletedTasks() {
  const cul = document.getElementById('completedList');
  Array.from(cul.children).forEach(li => li.classList.add('removing'));
  setTimeout(() => {
    completedTasks = [];
    saveTasks();
    renderTasks();
  }, 200);
}

function editTask(idx, li) {
  li.classList.add('editing');
  li.innerHTML = '';
  const input = document.createElement('input');
  input.type = 'text';
  input.value = tasks[idx].text;
  input.className = 'edit-input';
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.value = tasks[idx].dueDate || '';
  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾';
  saveBtn.className = 'complete-btn';
  saveBtn.onclick = () => {
    tasks[idx].text = input.value.trim();
    tasks[idx].dueDate = dateInput.value;
    saveTasks();
    renderTasks();
  };
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '✖';
  cancelBtn.className = 'delete-btn';
  cancelBtn.onclick = renderTasks;
  li.appendChild(input);
  li.appendChild(dateInput);
  li.appendChild(saveBtn);
  li.appendChild(cancelBtn);
  input.focus();
}

function setDarkMode(enabled) {
  const body = document.body;
  const app = document.getElementById('app');
  const quote = document.getElementById('quote');
  const counters = document.getElementById('counters');
  const h2s = document.querySelectorAll('h2');
  const toggle = document.getElementById('darkModeToggle');
  const inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
  const buttons = document.querySelectorAll('button');
  const lists = document.querySelectorAll('li, .quote, .counters, h2');
  const h1 = document.querySelector('h1');

  if (enabled) {
    body.classList.add('dark');
    app.classList.add('dark');
    quote.classList.add('dark');
    counters.classList.add('dark');
    h2s.forEach(h2 => h2.classList.add('dark'));
    toggle.classList.add('dark');
    toggle.textContent = '☀️';
    inputs.forEach(i => i.classList.add('dark'));
    buttons.forEach(b => b.classList.add('dark'));
    lists.forEach(l => l.classList.add('dark'));
    if (h1) h1.classList.add('dark');
  } else {
    body.classList.remove('dark');
    app.classList.remove('dark');
    quote.classList.remove('dark');
    counters.classList.remove('dark');
    h2s.forEach(h2 => h2.classList.remove('dark'));
    toggle.classList.remove('dark');
    toggle.textContent = '🌙';
    inputs.forEach(i => i.classList.remove('dark'));
    buttons.forEach(b => b.classList.remove('dark'));
    lists.forEach(l => l.classList.remove('dark'));
    if (h1) h1.classList.remove('dark');
  }
}

function updateDarkModeFromStorage() {
  const dark = localStorage.getItem('darkMode') === 'true';
  setDarkMode(dark);
}

document.addEventListener('DOMContentLoaded', () => {
  if (tasks.length && typeof tasks[0] === 'string') {
    tasks = tasks.map(t => ({ text: t, dueDate: '' }));
    saveTasks();
  }
  if (completedTasks.length && typeof completedTasks[0] === 'string') {
    completedTasks = completedTasks.map(t => ({ text: t, dueDate: '' }));
    saveTasks();
  }
  showRandomQuote();
  renderTasks();
  document.getElementById('taskInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  document.getElementById('dueDateInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  updateDarkModeFromStorage();
  document.getElementById('darkModeToggle').onclick = () => {
    const dark = !(localStorage.getItem('darkMode') === 'true');
    localStorage.setItem('darkMode', dark);
    setDarkMode(dark);
  };
});
