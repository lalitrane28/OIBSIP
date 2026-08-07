const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

// Load tasks when page opens
window.onload = loadTasks;

// Add task button
addBtn.addEventListener("click", addTask);

// Press Enter to add task
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Clear all tasks
clearBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("tasks");
        taskList.innerHTML = "";
        updateTaskCount();
    }
});

function addTask() {

    let task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(task, false);

    saveTasks();

    taskInput.value = "";

    updateTaskCount();
}

function createTask(taskText, completed) {

    const li = document.createElement("li");

    if (completed) {
        li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = taskText;

    const buttonDiv = document.createElement("div");

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";

    completeBtn.onclick = function () {
        li.classList.toggle("completed");
        saveTasks();
    };

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";

    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
        updateTaskCount();
    };

    buttonDiv.appendChild(completeBtn);
    buttonDiv.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonDiv);

    taskList.appendChild(li);
}

function saveTasks() {

    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(function (li) {

        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (task) {
        createTask(task.text, task.completed);
    });

    updateTaskCount();
}

function updateTaskCount() {

    let total = document.querySelectorAll("#taskList li").length;

    taskCount.textContent = "Total Tasks: " + total;
}