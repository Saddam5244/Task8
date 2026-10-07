import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || 'pending',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
    }
    setValidationError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setValidationError('Task title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button
            id="btn-close-modal"
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {validationError && (
          <div className="form-error-alert">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="task-title-input">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title-input"
              name="title"
              type="text"
              placeholder="e.g., Complete MongoDB integration"
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              required
              autoFocus
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description-input">Description</label>
            <textarea
              id="task-description-input"
              name="description"
              rows={3}
              placeholder="Add optional notes or details about this task..."
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="task-priority-select">Priority</label>
              <select
                id="task-priority-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group half">
              <label htmlFor="task-status-select">Status</label>
              <select
                id="task-status-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-duedate-input">Due Date (Optional)</label>
            <input
              id="task-duedate-input"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button
              id="btn-cancel-modal"
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-submit-task"
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              <Check size={18} />
              <span>{isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
