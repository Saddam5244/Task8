const mongoose = require('mongoose');

// Middleware to validate MongoDB ObjectId in route params
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a valid 24-character hexadecimal ObjectId.`
      });
    }
    next();
  };
};

// Middleware to validate task creation payload
const validateCreateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string.'
    });
  }

  if (title.trim().length > 120) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot exceed 120 characters.'
    });
  }

  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status '${status}'. Allowed values are: ${validStatuses.join(', ')}.`
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority '${priority}'. Allowed values are: ${validPriorities.join(', ')}.`
    });
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid dueDate format. Must be a valid ISO Date string.'
    });
  }

  next();
};

// Middleware to validate task update payload
const validateUpdateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title must be a non-empty string.'
      });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot exceed 120 characters.'
      });
    }
  }

  const validStatuses = ['pending', 'in-progress', 'completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status '${status}'. Allowed values are: ${validStatuses.join(', ')}.`
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority !== undefined && !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority '${priority}'. Allowed values are: ${validPriorities.join(', ')}.`
    });
  }

  if (dueDate !== undefined && dueDate !== null && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid dueDate format. Must be a valid ISO Date string.'
    });
  }

  next();
};

// Middleware to validate status update payload
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in-progress', 'completed'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status is required and must be one of: ${validStatuses.join(', ')}.`
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus
};
