var tasks = load();
var list = document.getElementById('list');
var form = document.getElementById('form');
var input = document.getElementById('text');
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
  list.innerHTML = '';
  var shown = tasks.filter(function(t){
    if(currentFilter==='active') return !t.done;
    if(currentFilter==='done') return t.done;
    return true;
  });
  var empty = document.getElementById('empty');
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
  var remaining = tasks.filter(function(t){ return !t.done; }).length;
  var count = document.getElementById('count');
  if(count) count.textContent = remaining + ' tasks remaining • ' + tasks.length + ' total';
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  var text = input.value.trim();
  if(!text) return;
  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  save(); render();
});

// Event Delegation - ONE listener for Toggle + Delete
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

var filters = document.querySelector('.filters');
if(filters){
  filters.addEventListener('click', function(e){
    if(e.target.dataset.filter){
      currentFilter = e.target.dataset.filter;
      document.querySelectorAll('.filters button[data-filter]').forEach(function(b){ b.classList.remove('active'); });
      e.target.classList.add('active');
      render();
    }
    if(e.target.id === 'clearBtn'){
      tasks = tasks.filter(function(t){ return !t.done; });
      save(); render();
    }
  });
}
render();
