const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const taskContainer = document.getElementById("task-container");

const sortPriorityButton = document.getElementById("sort-priority");
const sortDeadlineButton = document.getElementById("sort-deadline");

let tasks = [];

addTaskButton.addEventListener("click", () => {
    const task = taskInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task.trim() === "" || deadline === "") {
        alert("Please enter a task and select an upcoming date for the deadline.");
        return; // Don't add task if task or deadline is empty
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
        alert("Please select an upcoming date for the deadline.");
        return; // Don't add task if deadline is not in the future
    }

    const daysLeft = Math.ceil((selectedDate - currentDate) / (1000 * 60 * 60 * 24));

    const newTask = { task, priority, deadline, daysLeft, done: false };

    tasks.push(newTask);
    renderTasks();

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";
});

sortPriorityButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.done); // Remove tasks marked as done
    tasks.sort((a, b) => {
        const priorityOrder = { top: 1, middle: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    renderTasks();
});

sortDeadlineButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.done); // Remove tasks marked as done
    tasks.sort((a, b) => a.daysLeft - b.daysLeft);
    renderTasks();
});

function renderTasks() {
    taskList.innerHTML = ""; // Clear the task list

    if (tasks.length === 0) {
        taskContainer.style.display = "none"; // Hide task container if there are no tasks
        return;
    }

    taskContainer.style.display = "block"; // Show task container if there are tasks

    tasks.forEach((taskItem) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        
        if (taskItem.done) {
            taskElement.classList.add("task-done");
        }

        taskElement.innerHTML = `
            <p>${taskItem.task}</p>
            <p>Priority: ${taskItem.priority}</p>
            <p class="deadline-text ${taskItem.daysLeft <= 3 ? 'deadline-warning' : ''}">Deadline: ${taskItem.deadline} (${taskItem.daysLeft} days left)</p>
            <div class="task-buttons">
                <button class="mark-done" ${taskItem.done ? 'disabled' : ''}>${taskItem.done ? 'Task Done' : 'Mark Done'}</button>
                <button class="remove-task">Remove Task</button>
            </div>
        `;

        taskList.appendChild(taskElement);
    });
}

taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("mark-done")) {
        const taskItem = event.target.parentElement.parentElement;
        const taskIndex = Array.from(taskList.children).indexOf(taskItem);

        tasks[taskIndex].done = true;
        taskItem.classList.add("task-done"); // Add class for completed task styling
        event.target.textContent = "Task Done";
        event.target.disabled = true;
    }

    if (event.target.classList.contains("remove-task")) {
        const taskItem = event.target.parentElement.parentElement;
        const taskIndex = Array.from(taskList.children).indexOf(taskItem);
        tasks.splice(taskIndex, 1); // Remove task from array
        taskList.removeChild(taskItem);

        if (tasks.length === 0) {
            taskContainer.style.display = "none"; // Hide task container if there are no tasks
        }
    }
});
