const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const countEl = document.getElementById('task-count');
const emptyMsg = document.getElementById('empty-msg');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  let filtered = tasks;
  if (filter === 'active') filtered = tasks.filter(t => !t.done);
  if (filter === 'done') filtered = tasks.filter(t => t.done);

  if (filtered.length === 0) {
    emptyMsg.style.display = 'block';
    if (tasks.length === 0) emptyMsg.textContent = 'No tasks yet. Add your first task above! 📝';
    else emptyMsg.textContent = 'No tasks in this filter! 🎉';
  } else {
    emptyMsg.style.display = 'none';
  }

  filtered.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    const doneBtn = document.createElement('button');
    doneBtn.className = 'done-btn';
    doneBtn.textContent = task.done ? '↩ Undo' : '✓ Done';
    doneBtn.onclick = () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    };
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
    };
    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.done).length;
  countEl.textContent = remaining + ' tasks remaining • ' + tasks.length + ' total';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') return;
  tasks.push({ text: text, done: false });
  saveTasks();
  renderTasks();
  input.value = '';
  input.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  });
});

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
});

renderTasks();
