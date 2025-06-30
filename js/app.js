document.addEventListener('DOMContentLoaded', () => {
    // Initialize date picker
    $('#task-due-date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });

    // Initialize the app
    TaskUI.init();
    const tasks = TaskStorage.getTasks();
    TaskUI.renderTasks(tasks);
    TaskUI.updateTaskStats();
});

// function initApp() {
//     // Load tasks from local storage
//     const tasks = TaskStorage.getTasks();
    
//     // Render tasks
//     TaskUI.renderTasks(tasks);
    
//     // Update stats
//     TaskUI.updateTaskStats();
// }

// function setupEventListeners() {
//     // UI Event Listeners
//     document.getElementById('add-task-btn').addEventListener('click', TaskUI.openTaskModal);
//     document.querySelector('.close-modal').addEventListener('click', TaskUI.closeTaskModal);
    
//     // Form Event Listener
//     document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
    
//     // Filter Event Listeners
//     document.getElementById('search-input').addEventListener('input', 
//     TaskUI.filterTasks.bind(TaskUI));
//     document.getElementById('priority-filter').addEventListener('change', TaskUI.filterTasks);
//     document.getElementById('status-filter').addEventListener('change', TaskUI.filterTasks);
// }

// function handleTaskSubmit(e) {
//     e.preventDefault();
    
//     const form = e.target;
//     const taskId = form.taskId.value;
//     const taskData = {
//         title: form.taskTitle.value.trim(),
//         description: form.taskDescription.value.trim(),
//         priority: form.taskPriority.value,
//         dueDate: form.taskDueDate.value,
//         status: 'todo' // Default status
//     };
    
//     if (!taskData.title) {
//         alert('Task title is required!');
//         return;
//     }
    
//     if (taskId) {
//         // Update existing task
//         const existingTask = TaskStorage.getTask(taskId);
//         taskData.status = existingTask.status; // Preserve status
//         TaskStorage.updateTask(taskId, taskData);
//     } else {
//         // Add new task
//         TaskStorage.addTask(taskData);
//     }
    
//     // Refresh UI
//     TaskUI.renderTasks(TaskStorage.getTasks());
//     TaskUI.updateTaskStats();
//     TaskUI.closeTaskModal();
// }