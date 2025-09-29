const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterStatus.value;
  taskList.innerHTML = '';

  tasks
    .filter(task => task.name.toLowerCase().includes(searchTerm))
    .filter(task => filter === 'all' || task.status === filter)
    .forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${task.status === 'completed' ? 'completed':''}">
          ${task.name} ${task.dueDate ? `(Due: ${task.dueDate})` : ''}
        </span>
        <div class="btns">
          ${task.status === 'pending' 
            ? `<button class="done-btn" data-done="${index}">Done</button>` 
            : `<button class="undo-btn" data-undo="${index}">Undo</button>`}
          <button class="delete-btn" data-delete="${index}">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });

  updateProgress();
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'completed').length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressBar.style.width = percent + '%';
  progressText.textContent = percent + '% Completed';
}

addTaskBtn.addEventListener('click', () => {
  if (taskInput.value.trim() !== '') {
    tasks.push({
      name: taskInput.value.trim(),
      dueDate: dueDateInput.value,
      status: 'pending'
    });

    // clear inputs
    taskInput.value = '';
    dueDateInput.value = '';
    searchInput.value = '';

    renderTasks();
  }
});

taskList.addEventListener('click', (e) => {
  if (e.target.dataset.done !== undefined) {
    tasks[e.target.dataset.done].status = 'completed';
    renderTasks();
  }
  if (e.target.dataset.undo !== undefined) {
    tasks[e.target.dataset.undo].status = 'pending';
    renderTasks();
  }
  if (e.target.dataset.delete !== undefined) {
    tasks.splice(e.target.dataset.delete, 1);
    renderTasks();
  }
});

searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);

renderTasks();
