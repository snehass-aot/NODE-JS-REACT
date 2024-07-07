import React, { useState } from 'react';
import close from '../../assets/images/x.svg';

function AddTaskModal({ handleAddTask, cancelTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duedate, setDuedate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = Date.now(); // Generate a timestamp for the task
    const newTask = { title, description, duedate, status: true, timestamp };
    handleAddTask(newTask);
  };

  return (
    <div className='modal'>
      <div className="head">
        <p>Add Task</p>
        <img src={close} alt="close" onClick={cancelTask}/>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="title">
          <p>Title*</p>
          <input
            type="text"
            placeholder='create two ad banners'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="description">
          <p>Description*</p>
          <textarea
            placeholder='Add your tasks'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="date">
          <p>Date*</p>
          <input
            type="date"
            value={duedate}
            onChange={(e) => setDuedate(e.target.value)}
          />
        </div>
        <div className="modalButton">
          <button type="button" className='cancel' onClick={cancelTask}>Cancel</button>
          <button type="submit" className='Add'>Add Task</button>
        </div>
      </form>
    </div>
  );
}

export default AddTaskModal;
