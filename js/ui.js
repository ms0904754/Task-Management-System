const TaskUI = {
    init() {
        this.initDragDrop();
        this.setupEventListeners();
        return this;
    },

    initDragDrop() {
        document.querySelectorAll('.column .tasks').forEach(column => {
            column.addEventListener('dragover', (e) => this.allowDrop(e));
            column.addEventListener('drop', (e) => this.drop(e));
        });
    },

    setupEventListeners() {
        // Add task button
        document.getElementById('add-task-btn')?.addEventListener('click', () => {
            this.openTaskModal();
        });

        // Close modal button
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            this.closeTaskModal();
        });

        // Form submission
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTaskSubmit(e);
            });
        }

        // Filter elements
        document.getElementById('search-input')?.addEventListener('input', () => {
            this.filterTasks();
        });
        document.getElementById('priority-filter')?.addEventListener('change', () => {
            this.filterTasks();
        });
        document.getElementById('status-filter')?.addEventListener('change', () => {
            this.filterTasks();
        });
    },

    handleTaskSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const taskData = {
            id: formData.get('id') || '',
            title: formData.get('title')?.trim() || '',
            description: formData.get('description')?.trim() || '',
            priority: formData.get('priority') || 'medium',
            dueDate: formData.get('dueDate') || '',
            status: 'todo' // Default status
        };

        if (!taskData.title) {
            alert('Task title is required!');
            return;
        }

        try {
            if (taskData.id) {
                // Update existing task
                const existingTask = TaskStorage.getTask(taskData.id);
                if (existingTask) {
                    taskData.status = existingTask.status;
                    TaskStorage.updateTask(taskData.id, taskData);
                }
            } else {
                // Add new task
                TaskStorage.addTask(taskData);
            }

            this.renderTasks(TaskStorage.getTasks());
            this.updateTaskStats();
            this.closeTaskModal();
        } catch (error) {
            console.error('Error handling task submission:', error);
            alert('An error occurred while saving the task.');
        }
    },

    renderTasks(tasks) {
        const clearContainers = ['todo-tasks', 'progress-tasks', 'done-tasks'];
        clearContainers.forEach(id => {
            const container = document.getElementById(id);
            if (container) container.innerHTML = '';
        });

        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            const container = document.getElementById(`${task.status}-tasks`);
            if (container) container.appendChild(taskElement);
        });

        this.makeTasksDraggable();
    },

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-card ${task.priority}-priority`;
        taskElement.id = `task-${task.id}`;
        taskElement.draggable = true;
        taskElement.dataset.id = task.id;

        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';

        taskElement.innerHTML = `
            <div class="task-actions">
                <button class="edit-task" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-task" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </div>
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description || 'No description'}</div>
            <div class="task-meta">
                <span class="priority-badge">${task.priority}</span>
                <span class="due-date">${dueDate}</span>
            </div>
        `;

        taskElement.querySelector('.edit-task')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.editTask(task.id);
        });

        taskElement.querySelector('.delete-task')?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.deleteTask(task.id);
        });

        taskElement.addEventListener('dragstart', (e) => this.drag(e));

        return taskElement;
    },

    openTaskModal(taskId = null) {
        const modal = document.getElementById('task-modal');
        const form = document.getElementById('task-form');
        if (!modal || !form) return;

        if (taskId) {
            const task = TaskStorage.getTask(taskId);
            if (task) {
                document.getElementById('modal-title').textContent = 'Edit Task';
                form.elements.id.value = task.id;
                form.elements.title.value = task.title;
                form.elements.description.value = task.description || '';
                form.elements.priority.value = task.priority;
                form.elements.dueDate.value = task.dueDate || '';
            }
        } else {
            document.getElementById('modal-title').textContent = 'Add New Task';
            form.reset();
            form.elements.id.value = '';
        }

        modal.style.display = 'block';
    },

    closeTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.style.display = 'none';
    },

    editTask(taskId) {
        if (!taskId) return;
        this.openTaskModal(taskId);
    },

    deleteTask(taskId) {
        if (!taskId) return;
        
        if (confirm('Are you sure you want to delete this task?')) {
            TaskStorage.deleteTask(taskId);
            this.renderTasks(TaskStorage.getTasks());
            this.updateTaskStats();
        }
    },

    filterTasks() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const priorityFilter = document.getElementById('priority-filter')?.value || 'all';
        const statusFilter = document.getElementById('status-filter')?.value || 'all';

        const tasks = TaskStorage.getTasks().filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                (task.description && task.description.toLowerCase().includes(searchTerm));
            const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

            return matchesSearch && matchesPriority && matchesStatus;
        });

        this.renderTasks(tasks);
    },

    updateTaskStats() {
        const tasks = TaskStorage.getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;

        const totalEl = document.getElementById('total-tasks');
        const completedEl = document.getElementById('completed-tasks');
        
        if (totalEl) totalEl.textContent = totalTasks;
        if (completedEl) completedEl.textContent = completedTasks;
    },

    drag(e) {
        if (!e.target.dataset.id) return;
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
    },

    allowDrop(e) {
        e.preventDefault();
    },

    drop(e) {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const column = e.target.closest('.column');
        
        if (!taskId || !column) return;
        
        const newStatus = column.dataset.status;
        TaskStorage.updateTaskStatus(taskId, newStatus);
        this.renderTasks(TaskStorage.getTasks());
        this.updateTaskStats();
    },

    makeTasksDraggable() {
        document.querySelectorAll('.task-card').forEach(task => {
            task.addEventListener('dragstart', (e) => this.drag(e));
        });
    }
};

// Initialize the UI when loaded
document.addEventListener('DOMContentLoaded', () => {
    TaskUI.init();
});