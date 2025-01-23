import React from 'react';

const TaskItem = ({ task, toggleCompletion, deleteTask, setSelectedTask }) => {
  return (
    <div
      className={`task-item ${task.isCompleted ? 'completed' : ''}`}
      onClick={() => setSelectedTask(task)} // Call showTaskDetails when task is clicked
    >
      <div className="task-header">
        <h2>{task.taskName}</h2>
        <p>{task.estimatedDate} at {task.estimatedTime}</p>
        <button onClick={(e) => {e.stopPropagation(); 
            deleteTask(task.id);}
            }>Delete</button>
        <div className="Che">
          <p>Completed:</p> <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => toggleCompletion(task.id)} // Toggle completion status
          /></div>
      </div>
    </div>
  );
};

export default TaskItem;
