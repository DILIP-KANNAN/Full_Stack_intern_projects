import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); 

  // Add a task to the list
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  // Toggle completion status of a task
  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };
  const editTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null); // Close the task details overlay after saving
  };
  // Delete a task from the list
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks); 
  };

  // Show task details in the center of the page
  // const showTaskDetails = (task) => {
  //   setSelectedTask(task);
  // };

  // Hide task details
  const hideTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className={`App ${isMobileView ? "mobile-view" : ""}`}>
      <Header />
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={isMobileView}
            onChange={() => setIsMobileView(!isMobileView)}
          />
          <span className="slider"></span>
        </label>
        <span>{isMobileView ? "Mobile View On" : "Mobile View Off"}</span>
      </div>
      <TaskForm
        addTask={addTask}
        task={taskBeingEdited || null}
        editTask={editTask}
        cancelEdit={taskBeingEdited ? () => setTaskBeingEdited(null) : null}
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
      />
      <TaskList
        tasks={tasks}
        toggleCompletion={toggleCompletion}
        deleteTask={deleteTask}
        setSelectedTask={setSelectedTask}
        isFormVisible={isFormVisible}
      />

      {/* Show Task Details in the Center */}
      {selectedTask && (
        <div className="task-details-overlay" onClick={hideTaskDetails}>
          <div className="task-details-box" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedTask.taskName}</h3>
            <p>Time to Complete: {selectedTask.estimatedTime}</p>
            <p>{selectedTask.description}</p>
            <button className="edit" onClick={() =>  {setTaskBeingEdited(selectedTask); hideTaskDetails();}}>
              Edit Task
            </button>
            <button className="del" onClick={() => deleteTask(selectedTask.id)}>Delete Task</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
