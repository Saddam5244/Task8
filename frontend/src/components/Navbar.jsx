import React from 'react';
import { CheckCircle2, ListTodo, Plus, Clock } from 'lucide-react';

const Navbar = ({ stats, onOpenCreateModal }) => {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-icon-wrapper">
          <ListTodo className="brand-icon" size={26} />
        </div>
        <div>
          <h1 className="brand-title">TaskFlow Pro</h1>
          <p className="brand-subtitle">To-Do List Manager &bull; Node &amp; React Fullstack</p>
        </div>
      </div>

      <div className="navbar-right">
        <div className="task-stats-badge">
          <span className="stat-pill total">
            <strong>{stats.total}</strong> Tasks
          </span>
          <span className="stat-pill pending">
            <Clock size={14} />
            <strong>{stats.pending}</strong> Pending
          </span>
          <span className="stat-pill completed">
            <CheckCircle2 size={14} />
            <strong>{stats.completed}</strong> Done
          </span>
        </div>

        <button
          id="btn-add-task-header"
          className="btn-primary"
          onClick={onOpenCreateModal}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
