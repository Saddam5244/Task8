const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const {
  validateObjectId,
  validateCreateTask,
  validateUpdateTask,
  validateUpdateStatus
} = require('../middlewares/validation');

// Route: /api/tasks
router
  .route('/')
  .get(taskController.getTasks.bind(taskController))
  .post(validateCreateTask, taskController.createTask.bind(taskController));

// Route: /api/tasks/:id
router
  .route('/:id')
  .get(validateObjectId('id'), taskController.getTaskById.bind(taskController))
  .put(validateObjectId('id'), validateUpdateTask, taskController.updateTask.bind(taskController))
  .delete(validateObjectId('id'), taskController.deleteTask.bind(taskController));

// Route: /api/tasks/:id/status
router
  .route('/:id/status')
  .patch(validateObjectId('id'), validateUpdateStatus, taskController.updateTaskStatus.bind(taskController));

module.exports = router;
