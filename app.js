
// To-Do app logic for advanced features
let todos = [];
let editIndex = null;
let reminderTimeouts = [];

const todoForm = document.getElementById('todo-form');
const todoTitle = document.getElementById('todo-title');
const todoDesc = document.getElementById('todo-desc');
const todoDate = document.getElementById('todo-date');
const todoPriority = document.getElementById('todo-priority');
const todoList = document.getElementById('todo-list');
const searchBar = document.getElementById('search-bar');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

function renderTodos(searchFilter = '') {
    todoList.innerHTML = '';
    let filtered = todos;
    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    }
    filtered.forEach((todo, idx) => {
        if (
            searchFilter &&
            !todo.title.toLowerCase().includes(searchFilter) &&
            !todo.desc.toLowerCase().includes(searchFilter)
        ) return;
        const li = document.createElement('li');
        li.className = `${todo.priority}${todo.completed ? ' completed' : ''}`;
        // Header row
        const header = document.createElement('div');
        header.className = 'todo-header';
        const title = document.createElement('span');
        title.className = 'todo-title';
        title.textContent = todo.title;
        header.appendChild(title);
        if (todo.due) {
            const date = document.createElement('span');
            date.className = 'todo-date';
            date.textContent = `Due: ${todo.due}`;
            header.appendChild(date);
        }
        li.appendChild(header);
        // Description
        if (todo.desc) {
            const desc = document.createElement('div');
            desc.className = 'todo-desc';
            desc.innerHTML = `<span style='font-weight:bold;color:#43c6ac;'>Notes:</span> ${todo.desc}`;
            li.appendChild(desc);
        }
        // Actions
        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        // Complete
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
        completeBtn.onclick = () => markComplete(todos.indexOf(todo));
        actions.appendChild(completeBtn);
        // Edit
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => startEdit(todos.indexOf(todo));
        actions.appendChild(editBtn);
        // Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodo(todos.indexOf(todo));
        actions.appendChild(deleteBtn);
        li.appendChild(actions);
        todoList.appendChild(li);
    });
}

function addTodo(e) {
    e.preventDefault();
    const title = todoTitle.value.trim();
    const desc = todoDesc.value.trim();
    const due = todoDate.value;
    const priority = todoPriority.value;
    if (!title) return;
    const todo = { title, desc, due, priority, completed: false };
    if (editIndex !== null) {
        todos[editIndex] = todo;
        editIndex = null;
    } else {
        todos.push(todo);
        scheduleReminder(todos.length - 1);
    }
    saveTodos();
    todoForm.reset();
    renderTodos(searchBar.value.trim().toLowerCase());
}

function deleteTodo(idx) {
    todos.splice(idx, 1);
    clearReminder(idx);
    saveTodos();
    renderTodos(searchBar.value.trim().toLowerCase());
}

function markComplete(idx) {
    todos[idx].completed = !todos[idx].completed;
    saveTodos();
    renderTodos(searchBar.value.trim().toLowerCase());
}

function startEdit(idx) {
    const todo = todos[idx];
    todoTitle.value = todo.title;
    todoDesc.value = todo.desc;
    todoDate.value = todo.due;
    todoPriority.value = todo.priority;
    editIndex = idx;
// Save and load from localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
    const data = localStorage.getItem('todos');
    if (data) {
        todos = JSON.parse(data);
    }
}
}

function scheduleReminder(idx) {
    clearReminder(idx);
    const todo = todos[idx];
    if (!todo.due) return;
    const dueTime = new Date(todo.due).getTime();
    const now = Date.now();
    if (dueTime > now) {
        reminderTimeouts[idx] = setTimeout(() => {
            let message = `Reminder: Task "${todo.title}" is due today!`;
            // Add motivational message based on title keywords
            const t = todo.title.toLowerCase();
            if (t.includes('read')) {
                message += "\nKeep turning the pages, your knowledge is growing!";
            } else if (t.includes('assignment')) {
                message += "\nYou can do it! Every step brings you closer to success.";
            } else if (t.includes('exercise') || t.includes('workout')) {
                message += "\nStay strong! Your effort pays off.";
            } else if (t.includes('call')) {
                message += "\nReach out and make a difference!";
            } else if (t.includes('meeting')) {
                message += "\nGreat things happen when you connect!";
            } else if (t.includes('project')) {
                message += "\nEvery big project starts with a single step!";
            } else {
                message += "\nYou are making progress. Keep going!";
            }
            alert(message);
        }, dueTime - now);
    }
}

function clearReminder(idx) {
    if (reminderTimeouts[idx]) {
        clearTimeout(reminderTimeouts[idx]);
        reminderTimeouts[idx] = null;
    }
}

todoForm.addEventListener('submit', addTodo);
searchBar.addEventListener('input', e => {
    renderTodos(e.target.value.trim().toLowerCase());
});
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.style.background = '#fff');
        this.style.background = '#43c6ac';
        this.style.color = '#fff';
        currentFilter = this.getAttribute('data-filter');
        renderTodos(searchBar.value.trim().toLowerCase());
    });
});

// Initial load
loadTodos();
renderTodos();
