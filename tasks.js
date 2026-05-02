// ========== TASK MANAGER JAVASCRIPT ==========
// Author: Qirat (2K25/CSE/121)
// Project: DevTasks - Smart Task Manager

// Sample tasks data
let tasks = [
    { id: 1, text: "Build database schema", completed: false },
    { id: 2, text: "Design user interface", completed: true },
    { id: 3, text: "Write API documentation", completed: false },
    { id: 4, text: "Test all features", completed: false }
];

let currentFilter = "all";

// Save tasks to localStorage (Database operation - INSERT/UPDATE)
function saveTasks() {
    localStorage.setItem("devTasks", JSON.stringify(tasks));
}

// Load tasks from localStorage (Database operation - RETRIEVE)
function loadTasks() {
    const saved = localStorage.getItem("devTasks");
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        saveTasks();
    }
}

// Display tasks based on filter (Database operation - SELECT)
function displayTasks() {
    const taskList = document.getElementById("taskList");
    
    let filteredTasks = tasks;
    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>✨ No tasks here! Add a new task above</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    taskList.innerHTML = filteredTasks.map(task => `
        <li class="task-item">
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
            <span class="task-text ${task.completed ? "completed" : ""}">${escapeHtml(task.text)}</span>
            <button class="delete-btn" data-id="${task.id}"><i class="fas fa-trash-alt"></i> Delete</button>
        </li>
    `).join("");
    
    updateStats();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const statsDiv = document.getElementById("stats");
    if (statsDiv) {
        statsDiv.innerHTML = `
            <i class="fas fa-chart-simple"></i> 
            ${completed}/${total} completed (${percentage}%) 
            <i class="fas fa-hourglass-half"></i> ${active} active 
            <i class="fas fa-save"></i> Auto-saved
        `;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add new task with animation (Database operation - CREATE/INSERT)
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    
    if (text === "") {
        // Shake animation for empty input
        const addBtn = document.getElementById("addBtn");
        addBtn.style.animation = "shake 0.3s ease";
        setTimeout(() => {
            addBtn.style.animation = "";
        }, 300);
        alert("📝 Please enter a task!");
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    tasks.push(newTask);
    saveTasks();
    displayTasks();
    input.value = "";
    input.focus();
    
    // Show success feedback
    const addBtn = document.getElementById("addBtn");
    addBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
        addBtn.style.transform = "";
    }, 200);
}

// Toggle task completion (Database operation - UPDATE)
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    }
}

// Delete task with confirmation (Database operation - DELETE)
function deleteTask(taskId) {
    if (confirm("🗑️ Delete this task?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        displayTasks();
    }
}

// Set up event listeners
function setupEventListeners() {
    const addBtn = document.getElementById("addBtn");
    if (addBtn) {
        addBtn.addEventListener("click", addTask);
    }
    
    const taskInput = document.getElementById("taskInput");
    if (taskInput) {
        taskInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addTask();
        });
    }
    
    const taskList = document.getElementById("taskList");
    if (taskList) {
        taskList.addEventListener("click", (e) => {
            if (e.target.classList.contains("task-checkbox")) {
                toggleTask(parseInt(e.target.dataset.id));
            } else if (e.target.classList.contains("delete-btn") || e.target.parentElement?.classList.contains("delete-btn")) {
                const btn = e.target.classList.contains("delete-btn") ? e.target : e.target.parentElement;
                deleteTask(parseInt(btn.dataset.id));
            }
        });
    }
    
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            displayTasks();
        });
    });
}

// Initialize the application
function init() {
    loadTasks();           // Load data from database
    displayTasks();        // Display tasks
    setupEventListeners(); // Set up event handlers
}

// Start when page loads
document.addEventListener("DOMContentLoaded", init);