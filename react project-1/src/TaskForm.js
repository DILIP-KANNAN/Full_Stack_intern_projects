import React, { useState, useEffect } from "react";

function TaskForm({ addTask, task = null, editTask, cancelEdit, isFormVisible, setIsFormVisible }) {
  const [taskName, setTaskName] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTaskName(task.taskName);
      setEstimatedDate(task.estimatedDate ||""); // Default to next day's date if not provided
      setEstimatedTime(task.estimatedTime || "");  // Default to current time if not provided
      setDescription(task.description || ""); // Default description
      setIsFormVisible(true);  // Ensure form is visible when editing
    } else {
      setIsFormVisible(false);  // Hide form when no task is being edited
    }
  }, [task, setIsFormVisible]);
  const getNextDayDate = () => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1); // Set to the next day
    return nextDay.toISOString().split('T')[0]; // Return date as YYYY-MM-DD
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0'); // Get hours in 24-hour format
    const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Get minutes, padded to two digits
    return `${hours}:${minutes}`; // Format as HH:mm
  };  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      ...task, // Keep existing task ID if editing
      taskName: taskName || "",
      estimatedDate: estimatedDate || getNextDayDate(),
      estimatedTime: estimatedTime || getCurrentTime(),
      description: description || "No description was given",
    };
    task ? editTask(newTask) : addTask(newTask);
    clearForm();
    setIsFormVisible(false);
  };

  const clearForm = () => {
    setTaskName("");
    setEstimatedDate("");
    setEstimatedTime("");
    setDescription("");
    setIsFormVisible(false); // Close form
    if (cancelEdit) cancelEdit();
  };

  return (
    <div className='di'>
      <button className="but" onClick={() => {if (isFormVisible) {
      clearForm(); 
    }
    setIsFormVisible(!isFormVisible);
      }}>
        {isFormVisible ? "Cancel" : "Add New Task"}
      </button>
      <div className={`form-container ${isFormVisible ? "visible" : ""}`}>
        {isFormVisible && (
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <input
              type="date"
              value={estimatedDate}
              onChange={(e) => setEstimatedDate(e.target.value)}
              //required
            />
            <input
              type="time"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              //required
            />
            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              //required
            />
            <button type="submit">{task ? "Save Changes" : "Add Task"}</button>
            {task && <button onClick={ ()=>{ cancelEdit(); clearForm(); } }>Cancel</button>}
          </form>
        )}
      </div>
    </div>
  );
}

export default TaskForm;
