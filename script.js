const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

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

	const taskItem = document.createElement("div");
	taskItem.classList.add("task");
	taskItem.innerHTML = `
	<p>${task}</p>
	<p>Priority: ${priority}</p>
	<p>Deadline: ${deadline} (${daysLeft} days left)</p>
	<div class="task-buttons">
		<button class="mark-done">Mark Done</button>
		<button class="remove-task">Remove Task</button>
	</div>
`;

	taskList.appendChild(taskItem);

	taskInput.value = "";
	priorityInput.value = "top";
	deadlineInput.value = "";
});

taskList.addEventListener("click", (event) => {
	if (event.target.classList.contains("mark-done")) {
		const taskItem = event.target.parentElement.parentElement;
		const taskDescription = taskItem.querySelector("p");
		taskDescription.style.textDecoration = "line-through";
		taskItem.style.backgroundColor = "#f2f2f2";
		event.target.textContent = "Task Done";
		event.target.disabled = true;
	}

	if (event.target.classList.contains("remove-task")) {
		const taskItem = event.target.parentElement.parentElement;
		const isDone = taskItem.querySelector('.mark-done').disabled;

		if (!isDone) {
			const confirmRemove = confirm("Do you really want to remove this task without completing it?");
			if (!confirmRemove) {
				return; // Don't remove the task if the user cancels
			}
		}

		taskList.removeChild(taskItem);
	}
});
