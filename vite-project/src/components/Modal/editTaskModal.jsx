import React, { useState, useEffect } from 'react';
import close from '../../assets/images/x.svg';
import './editTaskModal.css';

function EditTaskModal({ task, handleEditTask }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [duedate, setDuedate] = useState(task.duedate);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDuedate(task.duedate);
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { ...task, title, description, duedate };
    handleEditTask(updatedTask);
  };

  return (
    <div className='modal'>
      <div className="head">
        <p>Edit Task</p>
        <img src={close} alt="close" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="title">
          <p>Title*</p>
          <input
            type="text"
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
          <button type="button" className='cancel'>Cancel</button>
          <button type="submit" className='update'>Update</button>
        </div>
      </form>
    </div>
  );
}

export default EditTaskModal;
