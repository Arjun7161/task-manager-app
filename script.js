class Task {
    constructor(title, description, priority, category) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}


class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
        saveTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        saveTasks();
    }

    updateTask(id, newData) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.title = newData.title;
            task.description = newData.description;
            task.priority = newData.priority;
            task.category = newData.category;
        }
        saveTasks();
    }

    getTasks() {
        return this.tasks;
    }

    filterByCategory(category) {
        if (category === "all") return this.tasks;
        return this.tasks.filter(t => t.category === category);
    }

    searchTasks(keyword, category = "all") {
        let tasksToSearch = this.filterByCategory(category);
        return tasksToSearch.filter(t =>
            t.title.toLowerCase().includes(keyword.toLowerCase()) ||
            t.description.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    sortByPriority() {
        const order = { high: 1, medium: 2, low: 3 };
        this.tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    }
}

const manager = new TaskManager();
let editingTaskId = null;

const taskList = document.getElementById("taskList");
const notification = document.getElementById("notification");


function showNotification(message) {
    notification.innerText = message;
    notification.style.display = "block";
    setTimeout(() => { notification.style.display = "none"; }, 4000);
}


function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task ${task.priority} ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Priority: ${task.priority}</p>
            <p>Category: ${task.category}</p>
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;


        li.querySelector(".complete-btn").addEventListener("click", () => completeTask(task.id));
        li.querySelector(".edit-btn").addEventListener("click", () => editTask(task.id));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));

        taskList.appendChild(li);
    });
}

// ======= Add / Update Task =======
document.getElementById("addTask").addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value;

    if (title.trim() === "") {
        document.getElementById("error").innerText = "Title cannot be empty";
        return;
    }

    if (editingTaskId) {
        manager.updateTask(editingTaskId, { title, description, priority, category });
        showNotification("Task updated");
        editingTaskId = null;
    } else {
        const task = new Task(title, description, priority, category);
        manager.addTask(task);
        if (priority === "high") showNotification("High priority task added!");
    }

    renderTasks(manager.getTasks());
    clearForm();
});

// ======= Delete Task =======
function deleteTask(id) {
    manager.deleteTask(id);
    renderTasks(manager.getTasks());
}

// ======= Complete Task =======
function completeTask(id) {
    const task = manager.tasks.find(t => t.id === id);
    if (task) {
        task.toggleComplete();
        saveTasks();
        if (task.priority === "high" && task.completed) {
            showNotification("High priority task completed!");
        }
    }
    renderTasks(manager.getTasks());
}

// ======= Edit Task =======
function editTask(id) {
    const task = manager.tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("priority").value = task.priority;
    document.getElementById("category").value = task.category;

    editingTaskId = id;
}

// ======= Clear Form =======
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("error").innerText = "";
}

// ======= Search Tasks =======
document.getElementById("search").addEventListener("input", (e) => {
    const keyword = e.target.value;
    const category = document.getElementById("filterCategory").value;
    const results = manager.searchTasks(keyword, category);
    renderTasks(results);
});

// ======= Filter by Category =======
document.getElementById("filterCategory").addEventListener("change", (e) => {
    const category = e.target.value;
    const keyword = document.getElementById("search").value;
    const results = manager.searchTasks(keyword, category);
    renderTasks(results);
});

// ======= Sort by Priority =======
document.getElementById("sortPriority").addEventListener("click", () => {
    manager.sortByPriority();
    renderTasks(manager.getTasks());
});

// ======= Theme Toggle =======
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ======= Local Storage =======
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(manager.tasks));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) {
        manager.tasks = saved;
        renderTasks(manager.tasks);
    }
}

loadTasks();