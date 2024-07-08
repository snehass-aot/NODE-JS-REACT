import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Search from '../components/Search/Search';
import AddTaskModal from '../components/Modal/AddTaskModal';
import EditTaskModal from '../components/Modal/editTaskModal';
import DeleteTaskModal from '../components/Modal/DeleteTaskModal';
import axios from 'axios';
import yellow from '../assets/images/yellow.svg';
import green from '../assets/images/green.svg';
import calendar from '../assets/images/calender.svg';

import edit from '../assets/images/edit.svg';
import deleteIcon from '../assets/images/delete.svg';

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
      fetchTasks();
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

  const handleClearCompletedTasks = async () => {
    try {
      await axios.delete('http://localhost:3000/todos/completed');
      fetchTasks();
    } catch (error) {
      console.error('Error clearing completed tasks:', error.response);
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
    setShowEditModal(true);
  };

  const displayDeleteModal = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
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

const isDueDateOver = (dueDate) => {
  const currentDate = new Date();
  // const taskDueDate = new Date(dueDate);
  return new Date(dueDate) < currentDate;
};

const TaskItem = ({ task, displayEditModal, displayDeleteModal, handleStatusChange }) => {
  // const dueDateClass = isDueDateOver(task.duedate) ? 'due-date-over' : '';

  return (
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
          <div className="headerContainer">
            <p>{task.title}</p>
            {task.status ?
              (<img src={yellow} alt="yellow-dot" />) : (<img src={green} alt="green-dot" />)
            }
          </div>
          <div className="icons">
            <img src={edit} alt="edit" onClick={() => displayEditModal(task)} />
            <img src={deleteIcon} alt="delete" onClick={() => displayDeleteModal(task)} />
          </div>
        </div>
        <span>{task.description}</span>
        <span className={isDueDateOver(task.duedate) ? 'due-date-over' : ''}><img src={calendar} alt="" /> by {task.duedate}</span>
      </div>
    </div>
  );
};

export default Index;
