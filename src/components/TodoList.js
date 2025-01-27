import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Filter, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');

  // API base URL
  const API_URL = 'http://localhost:3000/api';;

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };



  
  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }
    try {
      await axios.post(`${API_URL}/tasks`, { text: newTask, completed: false });
      setNewTask('');
      fetchTasks();
      setError('');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'COMPLETED') return task.completed;
    if (filter === 'PENDING') return !task.completed;
    return true;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h1 className="todo-title">Todo List</h1>
        </div>
        <div className="todo-content">
          <form onSubmit={addTask} className="todo-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="todo-input"
              placeholder="Add a new task..."
            />
            <button type="submit" className="add-button">
              <Plus size={20} />
              Add Task
            </button>
          </form>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="filter-container">
            <button
              onClick={() => setFilter('ALL')}
              className={`filter-button ${filter === 'ALL' ? 'active' : ''}`}
            >
              <Filter size={16} />
              All
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`filter-button ${filter === 'COMPLETED' ? 'active' : ''}`}
            >
              <Check size={16} />
              Completed
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`filter-button ${filter === 'PENDING' ? 'active' : ''}`}
            >
              <Filter size={16} />
              Pending
            </button>
          </div>

          <div className="todo-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="todo-item">
                <div className="todo-checkbox-container">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="todo-checkbox"
                  />
                  <span className={`todo-text ${task.completed ? 'completed' : ''}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                  aria-label="Delete task"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;