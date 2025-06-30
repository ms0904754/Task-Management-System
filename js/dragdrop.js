// Initialize drag and drop on columns
columns = document.querySelectorAll('.column');
columns.forEach(column => {
    column.addEventListener('dragover', TaskUI.allowDrop);
    column.addEventListener('drop', TaskUI.drop);
});

// Make individual tasks draggable
function initializeDragAndDrop() {
    document.querySelectorAll('.task-card').forEach(task => {
        task.addEventListener('dragstart', TaskUI.drag);
    });
}