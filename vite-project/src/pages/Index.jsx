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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

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

  const handleEditTask = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:3000/todos/${updatedTask.id}`, updatedTask);
      fetchTasks(); // Fetch the updated list of tasks
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${taskId}`);
      fetchTasks(); // Fetch the updated list of tasks
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleClearCompletedTasks = async () => {
    try {
        await axios.delete('http://localhost:3000/todos/completed');
        fetchTasks(); // Fetch the updated list of tasks
    } catch (error) {
        console.error('Error clearing completed tasks:', error.response); // Log the error response
    }
};



  const handleStatusChange = async (task) => {
    try {
      const updatedTask = { ...task, status: !task.status };
      await axios.put(`http://localhost:3000/todos/${updatedTask.id}`, updatedTask);
      fetchTasks(); // Fetch the updated list of tasks
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filterAndSortTasks = (tasks, searchTerm, sortOption) => {
    let filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === 'newest') {
      filteredTasks = filteredTasks.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortOption === 'oldest') {
      filteredTasks = filteredTasks.sort((a, b) => a.timestamp - b.timestamp);
    }

    return filteredTasks;
  };

  const sortedActiveTasks = filterAndSortTasks(activeTasks, searchTerm, sortOption);
  const sortedCompletedTasks = filterAndSortTasks(completedTasks, searchTerm, sortOption);

  return (
    <div>
      <NavBar displayModal={displayModal} />
      <Search handleSearch={handleSearch} handleSortChange={handleSortChange} />
      {showModal && <AddTaskModal handleAddTask={handleAddTask} cancelTask={cancelTask} />}
      <div className="task-container">
        <h3>Active Tasks</h3>
        {sortedActiveTasks.map(task => (
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
        <div className="completedTask">
          <h3>Completed Tasks</h3>
          <button onClick={handleClearCompletedTasks}>Clear Completed Tasks</button>
        </div>
        {sortedCompletedTasks.map(task => (
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
          {displayEditModal && <img src={edit} alt="edit" onClick={() => displayEditModal(task)} />}
          {displayDeleteModal && <img src={deleteIcon} alt="delete" onClick={() => displayDeleteModal(task)} />}
        </div>
      </div>
      <span>{task.description}</span>
      <span>{task.duedate}</span>
    </div>
  </div>
);

export default Index;
