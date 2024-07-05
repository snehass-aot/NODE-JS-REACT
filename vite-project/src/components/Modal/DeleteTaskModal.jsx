import React from 'react'
import close from '../../assets/images/x.svg'
import './DeleteTaskModal.css'

function DeleteTaskModal() {
  return (
    <div className='deletemodal'>
        <div className="head">
            <p>Delete Task</p>
            <img src={close} alt="close" />
        </div>
        <div className="title">
            <p>Are you sure you want to delete this task?</p>
        </div>
        <div className="modalButton">
             <button className='cancel'>Cancel</button>
             <button className='delete'>Delete</button>
        </div>
        
      
    </div>
  )
}

export default DeleteTaskModal
