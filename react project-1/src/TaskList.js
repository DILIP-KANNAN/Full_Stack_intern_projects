import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, toggleCompletion, deleteTask, setSelectedTask, isFormVisible }) => {
  return (
    <div className={`task-list ${isFormVisible ? 'hidden' : ''}`}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleCompletion={toggleCompletion}
          deleteTask={deleteTask}
          setSelectedTask={setSelectedTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
