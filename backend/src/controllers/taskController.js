const taskService = require('../services/taskService');

/**
 * Controller handling HTTP requests for Tasks
 */
class TaskController {
  /**
   * @route GET /api/tasks
   * @desc Get all tasks (supports search, filter, sort)
   */
  async getTasks(req, res, next) {
    try {
      const tasks = await taskService.getAllTasks(req.query);
      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route GET /api/tasks/:id
   * @desc Get a single task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route POST /api/tasks
   * @desc Create a new task
   */
  async createTask(req, res, next) {
    try {
      const newTask = await taskService.createTask(req.body);
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route PUT /api/tasks/:id
   * @desc Update task details
   */
  async updateTask(req, res, next) {
    try {
      const updatedTask = await taskService.updateTask(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route PATCH /api/tasks/:id/status
   * @desc Update task status only
   */
  async updateTaskStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updatedTask = await taskService.updateTaskStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: `Task status updated to '${status}' successfully`,
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route DELETE /api/tasks/:id
   * @desc Delete a task
   */
  async deleteTask(req, res, next) {
    try {
      const deletedTask = await taskService.deleteTask(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: deletedTask
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
