class Task {
    constructor(title, description, priority, category) {

        this.id = Date.now()

        this.title = title
        this.description = description
        this.priority = priority
        this.category = category
        this.completed = false

    }

    toggleComplete() {

        this.completed = !this.completed
    }

}

class TaskManager {
    constructor() {
        this.tasks = []
    }

    addTask(task) {
        this.tasks.push(task)
        saveTasks()
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id === id)

        if (task) {
            task.title = newData.title
            task.description = newData.description
            task.priority = newData.priority
            task.category = newData.category

        }

        saveTasks()
    }

    getTasks() {
        return this.tasks
    }

    filterByCategory(category) {
        if (category === "all") return this.tasks

        return this.tasks.filter(t => t.category === category)
    }

    searchTasks(keyword) {
        return this.tasks.filter(t => t.title.toLowerCase().includes(keyword.toLowerCase()) ||
            t.description.toLowerCase().includes(keyword.toLowerCase()))
    }
    sortByPriority() {

        const order = { high: 1, medium: 2, low: 3 }

        this.tasks.sort((a, b) => order[a.priority] - order[b.priority])

    }

}



const manager = new TaskManager()

let editingTaskId = null

const taskList = document.getElementById("taskList")

const notification = document.getElementById("notification")



function showNotification(message) {

    notification.innerText = message

    notification.style.display = "block"

    setTimeout(() => {

        notification.style.display = "none"

    }, 4000)

}



function renderTasks(tasks) {

    taskList.innerHTML = ""

    tasks.forEach(task => {

        const li = document.createElement("li")

        li.className = `task ${task.priority} ${task.completed ? "completed" : ""}`

        li.innerHTML = `

<h3>${task.title}</h3>

<p>${task.description}</p>

<p>Priority: ${task.priority}</p>

<p>Category: ${task.category}</p>

<button onclick="completeTask(${task.id})">Complete</button>

<button onclick="editTask(${task.id})">Edit</button>

<button onclick="deleteTask(${task.id})">Delete</button>

`

        taskList.appendChild(li)

    })

}



document.getElementById("addTask").addEventListener("click", () => {

    const title = document.getElementById("title").value

    const description = document.getElementById("description").value

    const priority = document.getElementById("priority").value

    const category = document.getElementById("category").value

    if (title.trim() === "") {

        document.getElementById("error").innerText = "Title cannot be empty"

        return

    }

    if (editingTaskId) {

        manager.updateTask(editingTaskId, { title, description, priority, category })

        editingTaskId = null

        showNotification("Task updated")

    }

    else {

        const task = new Task(title, description, priority, category)

        manager.addTask(task)

        if (priority === "high") {

            showNotification("High priority task added!")

        }

    }

    renderTasks(manager.getTasks())

    clearForm()

})



function deleteTask(id) {

    manager.deleteTask(id)

    renderTasks(manager.getTasks())

}



function completeTask(id) {

    let task = manager.tasks.find(t => t.id === id)

    if (task) {

        task.toggleComplete()

        saveTasks()

        if (task.priority === "high") {

            showNotification("High priority task completed!")

        }

    }

    renderTasks(manager.getTasks())

}



function editTask(id) {

    let task = manager.tasks.find(t => t.id === id)

    document.getElementById("title").value = task.title

    document.getElementById("description").value = task.description

    document.getElementById("priority").value = task.priority

    document.getElementById("category").value = task.category

    editingTaskId = id

}



function clearForm() {

    document.getElementById("title").value = ""

    document.getElementById("description").value = ""

}



document.getElementById("search").addEventListener("input", (e) => {

    const results = manager.searchTasks(e.target.value)

    renderTasks(results)

})



document.getElementById("filterCategory").addEventListener("change", (e) => {

    const filtered = manager.filterByCategory(e.target.value)

    renderTasks(filtered)

})



document.getElementById("sortPriority").addEventListener("click", () => {

    manager.sortByPriority()

    renderTasks(manager.getTasks())

})



document.getElementById("themeToggle").addEventListener("click", () => {

    document.body.classList.toggle("dark")

})



function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(manager.tasks))

}



function loadTasks() {

    const saved = JSON.parse(localStorage.getItem("tasks"))

    if (saved) {

        manager.tasks = saved

        renderTasks(manager.tasks)

    }
}

loadTasks()