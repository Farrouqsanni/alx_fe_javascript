document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    function addTask() {
        const taskText = taskInput.value.trim();
<<<<<<< HEAD
        if (taskText === '') {
            alert('Please enter a task.');
=======
        if(taskText === "") {
            alert("Please enter a task!");
>>>>>>> de4e4142b2409de93930e91c4a5f20339b303236
            return;
        }
        const li = document.createElement('li');
        li.textContent = taskText;

        const removeBtn = document.createElement('button');
<<<<<<< HEAD
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
=======
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";
>>>>>>> de4e4142b2409de93930e91c4a5f20339b303236
        removeBtn.onclick = () => taskList.removeChild(li);

        li.appendChild(removeBtn);
        taskList.appendChild(li);
<<<<<<< HEAD
        taskInput.value = '';
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
=======
        taskInput.value = "";
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') addTask();
>>>>>>> de4e4142b2409de93930e91c4a5f20339b303236
    });
});
