import React from 'react'
import close from '../../assets/images/x.svg'
import './editTaskModal.css'

function EditTaskModal() {
  return (
    <div className='modal'>
        <div className="head">
            <p>Edit Task</p>
            <img src={close} alt="close" />
        </div>
        <div className="title">
            <p>Title*</p>
            <input type="text" />
        </div>
        <div className="description">
            <p>Description*</p>
            <textarea placeholder='Add your tasks' />
        </div>
        <div className="date">
            <p>Date*</p>
            <input type="date" />
        </div>
        <div className="modalButton">
             <button className='cancel'>Cancel</button>
             <button className='update'>Update</button>
        </div>
        
      
    </div>
  )
}

export default EditTaskModal
