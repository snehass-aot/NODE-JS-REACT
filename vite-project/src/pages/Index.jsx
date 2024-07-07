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
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, searchQuery, sortOption]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/todos');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filterAndSortTasks = () => {
    let filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOption === 'newest') {
      filteredTasks = filteredTasks.sort((a, b) => new Date(b.duedate) - new Date(a.duedate));
    } else if (sortOption === 'oldest') {
      filteredTasks = filteredTasks.sort((a, b) => new Date(a.duedate) - new Date(b.duedate));
    }

    setActiveTasks(filteredTasks.filter(task => task.status));
    setCompletedTasks(filteredTasks.filter(task => !task.status));
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await axios.post('http://localhost:3000/todos', newTask);
      setTasks(response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:3000/todos/${updatedTask.id}`, updatedTask);
      fetchTasks();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${taskId}`);
      fetchTasks();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (task) => {
    try {
      const updatedTask = { ...task, status: !task.status };
      await axios.put(`http://localhost:3000/todos/${updatedTask.id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const displayModal = () => {
    setShowModal(!showModal);
  };

  const displayEditModal = (task) => {
    setSelectedTask(task);
    setShowEditModal(!showEditModal);
  };

  const displayDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(!showDeleteModal);
  };

  const cancelTask = () => {
    setShowModal(false);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div>
      <NavBar displayModal={displayModal} />
      <Search setSearchQuery={setSearchQuery} setSortOption={setSortOption} />
      {showModal && <AddTaskModal handleAddTask={handleAddTask} cancelTask={cancelTask} />}
      <div className="task-container">
        <h3>Active Tasks</h3>
        {activeTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            displayEditModal={displayEditModal}
            displayDeleteModal={displayDeleteModal}
            handleStatusChange={handleStatusChange}
          />
        ))}
      </div>
      <div className="task-container">
        <h3>Completed Tasks</h3>
        {completedTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            displayEditModal={displayEditModal}
            displayDeleteModal={displayDeleteModal}
            handleStatusChange={handleStatusChange}
          />
        ))}
      </div>
      {showEditModal && <EditTaskModal task={selectedTask} handleEditTask={handleEditTask} cancelEdit={cancelEdit} />}
      {showDeleteModal && <DeleteTaskModal task={selectedTask} handleDeleteTask={handleDeleteTask} cancelDelete={cancelDelete} />}
    </div>
  );
}

const TaskItem = ({ task, displayEditModal, displayDeleteModal, handleStatusChange }) => (
  <div className="task-item">
    <input
      type='checkbox'
      id='checkbox'
      className='checkbox'
      checked={!task.status}
      onChange={() => handleStatusChange(task)}
    />
    <div className="task-item-list">
      <div className="operationBtn">
        <p>{task.title}</p>
        <div className="icons">
          {displayEditModal && <img src={edit} alt="" onClick={() => displayEditModal(task)} />}
          {displayDeleteModal && <img src={deleteIcon} alt="" onClick={() => displayDeleteModal(task)} />}
        </div>
      </div>
      <span>{task.description}</span>
      <span>{task.duedate}</span>
    </div>
  </div>
);

export default Index;
