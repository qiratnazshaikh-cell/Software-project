// ========== HOME PAGE JAVASCRIPT with Progress Bar ==========

function loadAndUpdateStats() {
    const saved = localStorage.getItem("devTasks");
    if (saved) {
        const tasks = JSON.parse(saved);
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        // Animate counter
        animateCounter("totalTasks", total);
        animateCounter("completedTasks", completed);
        
        // Update progress bar
        const progressFill = document.getElementById("progressFill");
        if (progressFill) {
            progressFill.style.width = percentage + "%";
        }
    } else {
        const defaultTasks = [
            { id: 1, text: "Build database schema", completed: false },
            { id: 2, text: "Design user interface", completed: true },
            { id: 3, text: "Write API documentation", completed: false }
        ];
        localStorage.setItem("devTasks", JSON.stringify(defaultTasks));
        
        animateCounter("totalTasks", 3);
        animateCounter("completedTasks", 1);
        
        const progressFill = document.getElementById("progressFill");
        if (progressFill) {
            progressFill.style.width = "33%";
        }
    }
}

// Animate counter function
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

document.addEventListener("DOMContentLoaded", loadAndUpdateStats);