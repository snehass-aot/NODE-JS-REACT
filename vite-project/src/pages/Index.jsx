import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Search from '../components/Search/Search';
import AddTaskModal from '../components/Modal/AddTaskModal';
import edit from '../assets/images/edit.svg';
import deleteIcon from '../assets/images/delete.svg';
 import EditTaskModal from '../components/Modal/editTaskModal';
 import DeleteTaskModal from '../components/Modal/DeleteTaskModal';
import axios from 'axios';

function Index() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      const tasks = response.data;
      setTasks(tasks);
      setActiveTasks(tasks.filter(task => task.status));
      setCompletedTasks(tasks.filter(task => !task.status));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post('http://localhost:3000/todos', newTask);
      const updatedTasks = response.data;
      setTasks(updatedTasks);
      setActiveTasks(updatedTasks.filter(task => task.status));
      setCompletedTasks(updatedTasks.filter(task => !task.status));
      setShowModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const displayModal = () => {
    setShowModal(!showModal);
  };
  const displayEditModal = () => {
    setShowEditModal(!showEditModal);
    };
    const displayDeleteModal = () => {
      setShowDeleteModal(!showDeleteModal);
      };
  return (
    <div>
      <NavBar displayModal={displayModal} />
      <Search />
      {showModal && <AddTaskModal handleAddTask={handleAddTask} />}
      <div className="task-container">
        <h3>Active Tasks</h3>
        {activeTasks.map(task => (
          <TaskItem key={task.id} task={task} displayEditModal={displayEditModal} displayDeleteModal={displayDeleteModal}/>
        ))}
      </div>
      <div className="task-container">
        <h3>Completed Tasks</h3>
        {completedTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
     {showEditModal && <EditTaskModal />}
     {showDeleteModal && <DeleteTaskModal />}
    </div>
  );
}

const TaskItem = ({ task,displayEditModal,displayDeleteModal }) => (
  <div className="task-item">
    <input type='checkbox' id='checkbox' className='checkbox' />
    <div className="task-item-list">
      <div className="operationBtn">
        <p>{task.title}</p>
        <div className="icons">
          <img src={edit} alt="" onClick={displayEditModal}/>
          <img src={deleteIcon} alt="" onClick={displayDeleteModal}/>
        </div>
      </div>
      <span>{task.description}</span>
      <span>{task.duedate}</span>
    </div>

  </div>

);

export default Index;
