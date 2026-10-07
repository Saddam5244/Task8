import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import TaskItem from './components/TaskItem';
import TaskFormModal from './components/TaskFormModal';
import AlertBanner from './components/AlertBanner';
import { taskApi, getErrorMessage } from './api/taskApi';
import { Loader2, Plus, ClipboardList, RefreshCw } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Debounce search query input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Auto clear success message after 4s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch tasks from backend API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortOrder] = sortBy.split('-');
      const params = {
        search: debouncedSearch.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        sortBy: sortField,
        order: sortOrder
      };

      const res = await taskApi.getTasks(params);
      if (res.success && Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Stats calculation
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length
  };

  // 1. Create or Update Task Handler
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update task details
        const res = await taskApi.updateTask(editingTask._id, taskData);
        if (res.success) {
          setTasks((prev) =>
            prev.map((t) => (t._id === editingTask._id ? res.data : t))
          );
          setSuccessMessage('Task updated successfully.');
        }
      } else {
        // Create new task
        const res = await taskApi.createTask(taskData);
        if (res.success) {
          setTasks((prev) => [res.data, ...prev]);
          setSuccessMessage('New task created successfully.');
        }
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // 2. Toggle status (e.g. pending <-> completed)
  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
    );

    try {
      const res = await taskApi.updateTaskStatus(task._id, nextStatus);
      if (res.success) {
        setSuccessMessage(`Marked as ${nextStatus}.`);
      }
    } catch (err) {
      // Revert optimistic update on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
      setError(`Failed to update status: ${getErrorMessage(err)}`);
    }
  };

  // 3. Delete Task Handler
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      const res = await taskApi.deleteTask(taskId);
      if (res.success) {
        setSuccessMessage('Task deleted successfully.');
      }
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      setError(`Failed to delete task: ${getErrorMessage(err)}`);
    }
  };

  // Modal openers
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="app-layout">
      <Navbar stats={stats} onOpenCreateModal={handleOpenCreateModal} />

      <main className="main-content">
        <div className="container">
          {/* Notifications */}
          {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}
          {successMessage && (
            <AlertBanner
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {/* Controls: Search and Filters */}
          <section className="controls-panel">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <FilterBar
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </section>

          {/* Task List Section */}
          <section className="task-list-section">
            <div className="task-list-header">
              <h2 className="section-title">
                {statusFilter === 'all'
                  ? 'All Tasks'
                  : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`}
                <span className="count-tag">({tasks.length})</span>
              </h2>

              <button
                id="btn-refresh-tasks"
                type="button"
                className="btn-refresh"
                onClick={fetchTasks}
                disabled={loading}
                title="Reload Tasks from Server"
              >
                <RefreshCw size={15} className={loading ? 'spinning' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="state-card loading-state">
                <Loader2 className="spinning" size={36} />
                <p>Loading tasks from MongoDB...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="state-card empty-state">
                <div className="empty-icon-wrapper">
                  <ClipboardList size={48} />
                </div>
                <h3>No tasks found</h3>
                <p>
                  {debouncedSearch
                    ? `No tasks match your search query "${debouncedSearch}".`
                    : statusFilter !== 'all'
                    ? `No tasks with "${statusFilter}" status.`
                    : 'Your task list is empty. Create your first task to get started!'}
                </p>
                <button
                  id="btn-create-first-task"
                  className="btn-primary"
                  onClick={handleOpenCreateModal}
                >
                  <Plus size={18} />
                  <span>Create Task</span>
                </button>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
}

export default App;
