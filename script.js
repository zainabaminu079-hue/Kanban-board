let tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || '[]');
if(tasks.length===0){
  tasks = [
    {id:'1', text:'Design homepage', status:'todo'},
    {id:'2', text:'Build drag & drop', status:'doing'},
    {id:'3', text:'Project setup', status:'done'}
  ];
}
// Remove duplicates
tasks = tasks.filter((v,i,a)=>a.findIndex(t=>t.text===v.text && t.status===v.status)===i);

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');

function save(){
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}
function updateCounts(){
  document.querySelectorAll('.column').forEach(col=>{
    const status = col.dataset.status;
    const count = tasks.filter(t=>t.status===status).length;
    col.querySelector('.count').textContent = count;
  });
}
function render(){
  document.querySelectorAll('.task-list').forEach(list=>list.innerHTML='');
  tasks.forEach(task=>{
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = task.id;
    card.innerHTML = `<span>${task.text}</span> <button class="delete-btn">x</button>`;
    card.addEventListener('dragstart', (e)=>{e.dataTransfer.setData('text/plain', task.id);});
    card.querySelector('.delete-btn').addEventListener('click', ()=>{
      tasks = tasks.filter(t=>t.id!==task.id);
      save(); render();
    });
    const targetList = document.querySelector(`#${task.status} .task-list`);
    if(targetList) targetList.appendChild(card);
  });
  updateCounts();
}
document.querySelectorAll('.column').forEach(col=>{
  col.addEventListener('dragover', (e)=>{e.preventDefault();});
  col.addEventListener('drop', (e)=>{
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t=>t.id===id);
    if(task){task.status = col.dataset.status; save(); render();}
  });
});
function addTask(){
  const text = taskInput.value.trim();
  if(!text) return;
  tasks.push({id:Date.now().toString(), text, status:'todo'});
  taskInput.value=''; save(); render();
}
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e=>{if(e.key==='Enter') addTask();});
render();
