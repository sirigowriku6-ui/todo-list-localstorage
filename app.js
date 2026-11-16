var list = document.getElementById('task-list') || document.getElementById('list');
var form = document.getElementById('task-form') || document.getElementById('form');
var input = document.getElementById('task-input') || document.getElementById('text');
var tasks = load();
var currentFilter = 'all';

function load(){
  try{
    var data = JSON.parse(localStorage.getItem('tasks'));
    if(Array.isArray(data)) return data;
    return [];
  }catch(e){ return []; }
}
function save(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function render(){
  if(!list) return;
  list.innerHTML = '';
  var shown = tasks.filter(function(t){
    if(currentFilter==='active') return !t.done;
    if(currentFilter==='done') return t.done;
    return true;
  });

  var empty = document.getElementById('empty') || document.getElementById('empty-state') || document.getElementById('no-tasks');
  if(empty) empty.style.display = shown.length ? 'none' : 'block';

  shown.forEach(function(t){
    var li = document.createElement('li');
    if(t.done) li.className = 'done';
    var label = document.createElement('span');
    label.textContent = t.text;
    var toggle = document.createElement('button');
    toggle.textContent = t.done ? 'Undo' : 'Done';
    toggle.dataset.action = 'toggle';
    var del = document.createElement('button');
    del.textContent = 'Delete ❌';
    del.dataset.action = 'delete';
    li.append(label, toggle, del);
    li.dataset.id = t.id;
    list.append(li);
  });

  var count = document.getElementById('count') || document.getElementById('task-count') || document.getElementById('remaining');
  var remaining = tasks.filter(function(t){ return !t.done; }).length;
  if(count) count.textContent = remaining + ' tasks remaining';
}

if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var text = input.value.trim();
    if(!text) return;
    tasks.push({ id: Date.now(), text: text, done: false });
    input.value = '';
    save(); render();
  });
}

if(list){
  list.addEventListener('click', function(e){
    var action = e.target.dataset.action;
    if(!action) return;
    var id = Number(e.target.closest('li').dataset.id);
    if(action === 'delete'){
      tasks = tasks.filter(function(t){ return t.id !== id; });
    }
    if(action === 'toggle'){
      tasks.forEach(function(t){ if(t.id === id) t.done = !t.done; });
    }
    save(); render();
  });
}

// Filters - works with any button with data-filter
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-filter]');
  if(btn){
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    render();
  }
  if(e.target.closest('#clearBtn') || e.target.closest('#clear-completed') || e.target.textContent.trim() === 'Clear Completed'){
    if(e.target.tagName === 'BUTTON'){
      tasks = tasks.filter(function(t){ return !t.done; });
      save(); render();
    }
  }
});

render();
