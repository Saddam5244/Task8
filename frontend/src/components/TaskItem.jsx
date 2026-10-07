import React from 'react';
import { Calendar, Trash2, Edit3, Check, Circle, AlertCircle } from 'lucide-react';

const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const isPastDue = !isCompleted && date < now && date.toDateString() !== now.toDateString();

    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });

    return { formatted, isPastDue };
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <div className={`task-card ${isCompleted ? 'is-completed' : ''} priority-${task.priority}`}>
      <div className="task-card-left">
        <button
          id={`btn-toggle-${task._id}`}
          type="button"
          className={`status-toggle-btn ${task.status}`}
          onClick={() => onToggleStatus(task)}
          title={`Mark as ${isCompleted ? 'pending' : 'completed'}`}
          aria-label={`Toggle status for ${task.title}`}
        >
          {isCompleted ? <Check size={16} /> : <Circle size={16} />}
        </button>
      </div>

      <div className="task-card-content">
        <div className="task-header-row">
          <h3 className={`task-title ${isCompleted ? 'completed-text' : ''}`}>
            {task.title}
          </h3>
          <div className="task-badges">
            <span className={`badge badge-priority badge-${task.priority}`}>
              {task.priority}
            </span>
            <span className={`badge badge-status badge-${task.status}`}>
              {task.status}
            </span>
          </div>
        </div>

        {task.description && (
          <p className={`task-description ${isCompleted ? 'completed-text' : ''}`}>
            {task.description}
          </p>
        )}

        <div className="task-footer">
          {dueDateInfo && (
            <div className={`due-date-indicator ${dueDateInfo.isPastDue ? 'overdue' : ''}`}>
              {dueDateInfo.isPastDue ? <AlertCircle size={14} /> : <Calendar size={14} />}
              <span>{dueDateInfo.isPastDue ? 'Overdue: ' : 'Due: '} {dueDateInfo.formatted}</span>
            </div>
          )}

          <div className="task-actions">
            <button
              id={`btn-edit-${task._id}`}
              type="button"
              className="action-btn edit-btn"
              onClick={() => onEdit(task)}
              title="Edit Task"
              aria-label={`Edit ${task.title}`}
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
            <button
              id={`btn-delete-${task._id}`}
              type="button"
              className="action-btn delete-btn"
              onClick={() => onDelete(task._id)}
              title="Delete Task"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
