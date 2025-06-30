TaskStorage = {
    getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    },
    
    getTask(id) {
        return this.getTasks().find(task => task.id === id);
    },
    
    addTask(task) {
        const tasks = this.getTasks();
        task.id = Date.now().toString();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    
    updateTask(id, updatedTask) {
        let tasks = this.getTasks();
        tasks = tasks.map(task => task.id === id ? {...task, ...updatedTask} : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    
    updateTaskStatus(id, newStatus) {
        let tasks = this.getTasks();
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, status: newStatus};
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    
    deleteTask(id) {
        let tasks = this.getTasks();
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
};