const Task = require('../models/taskModel');

/**
 * Service to handle all Task database interactions and business logic
 */
class TaskService {
  /**
   * Retrieve tasks with optional filtering, search, and sorting
   * @param {Object} queryParams - Request query parameters
   * @returns {Promise<Array>} List of tasks
   */
  async getAllTasks(queryParams = {}) {
    const { search, q, status, priority, sortBy = 'createdAt', order = 'desc' } = queryParams;

    const filter = {};

    // Search query (case-insensitive regex on title and description)
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim() !== '') {
      filter.$or = [
        { title: { $regex: searchTerm.trim(), $options: 'i' } },
        { description: { $regex: searchTerm.trim(), $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sortOptions);
    return tasks;
  }

  /**
   * Retrieve a single task by ID
   * @param {string} id - Task ObjectId
   * @returns {Promise<Object>} Task document
   */
  async getTaskById(id) {
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error(`Task not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  /**
   * Create a new task
   * @param {Object} data - Task data payload
   * @returns {Promise<Object>} Created task
   */
  async createTask(data) {
    const task = await Task.create({
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    });
    return task;
  }

  /**
   * Update full/partial task details
   * @param {string} id - Task ObjectId
   * @param {Object} updateData - Data fields to update
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, updateData) {
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error(`Task not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    if (updateData.title !== undefined) task.title = updateData.title.trim();
    if (updateData.description !== undefined) task.description = updateData.description.trim();
    if (updateData.status !== undefined) task.status = updateData.status;
    if (updateData.priority !== undefined) task.priority = updateData.priority;
    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    const updatedTask = await task.save();
    return updatedTask;
  }

  /**
   * Update only the status of a task
   * @param {string} id - Task ObjectId
   * @param {string} status - New status value
   * @returns {Promise<Object>} Updated task
   */
  async updateTaskStatus(id, status) {
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error(`Task not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }

    task.status = status;
    const updatedTask = await task.save();
    return updatedTask;
  }

  /**
   * Delete a task by ID
   * @param {string} id - Task ObjectId
   * @returns {Promise<Object>} Deleted task document
   */
  async deleteTask(id) {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      const error = new Error(`Task not found with id: ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return task;
  }
}

module.exports = new TaskService();
