import '../assets/css/style.css';

const app = document.getElementById('app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">Todo List</h3>
        </div>
        <div class="todos-secondary-header">
            <p>You have <span class="todos-count">0</span> items</p>
            <button class="todos-clear" style="display: none;">Clear Completed</button>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="What's next?" name="todo">
        </form>
        <ul class="todos-list">
        </ul>
    </div>
    `;


// state
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// selectors
const root = document.querySelector(".todos");
const list = root.querySelector(".todos-list");
const count = root.querySelector(".todos-count");
const clear = root.querySelector(".todos-clear");
const todoForm = document.forms.todos;
const input = todoForm.elements.todo;

// function
function saveStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(todos) {
    let todoString = '';
    todos.forEach((todo, index) => {
        todoString += `
            <li data-id="${index}"${todo.complete ? ' class="todos-complete"' : ''}>
                <input type="checkbox"${todo.complete ? ' checked' : ''}>
                <span>${todo.label}</span>
                <button type="button"></button>
            </li>
        `
    });

    list.innerHTML = todoString;
    count.innerText = todos.filter(todo => !todo.complete).length;
    clear.style.display = todos.filter(todo => todo.complete).length ? 'block' : 'none';
}

function addTodo(event) {
    event.preventDefault();
    const label = input.value.trim();
    const complete = false;
    todos = [
        ...todos,
        {
            label,
            complete
        }
    ]
    renderTodos(todos);
    saveStorage(todos);
    input.value = '';
}

function updateTodo(event) {
    const id = parseInt(event.target.parentNode.getAttribute("data-id"), 10);
    const complete = event.target.checked;
    // console.log(id);
    todos = todos.map((todo, index) => {
        if (index === id) {
            return {
                ...todo,
                complete
            }
        }
        return todo;
    });
    renderTodos(todos);
    saveStorage(todos);
}

function deleteTodo(event) {
    if (event.target.nodeName.toLowerCase() !== "button") {
        return;
    }
    console.log(event);
    const id = parseInt(event.target.parentNode.getAttribute("data-id"), 10);
    console.log(id);
    const label = event.target.previousElementSibling.innerText;
    if (window.confirm(`Delete ${label}?`)) {
        //delete item
        todos = todos.filter((todo, index) => index !== id);
        renderTodos(todos);
        saveStorage(todos);
    }
}

function deleteCompletedTodo() {
    const selectedCount = todos.filter(todo => todo.complete).length;
    if (selectedCount === 0) {
        return;
    }
    if (window.confirm(`Delete ${selectedCount} todos?`)) {
        todos = todos.filter(todo => !todo.complete);
        renderTodos(todos);
        saveStorage(todos);
    }
}


// init
function init() {
    // render initial todos
    renderTodos(todos);
    // add a todo list
    todoForm.addEventListener("submit", addTodo);
    // update a todo list
    list.addEventListener("change", updateTodo);
    // delete todo list
    list.addEventListener("click", deleteTodo);
    // delete all selected todo lists
    clear.addEventListener("click", deleteCompletedTodo);
}

init();