const express= require('express');
const { createTask ,getTask,getTaskById, updateTask ,deleteTask, getOverdueTasks} = require('../controllers/task.controller');
const authMiddleware=require('../middleware/auth.middleware');

const router= express.Router();

/**
 * @swagger
 * /api/task/create:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete DSA
 *               description:
 *                 type: string
 *                 example: Solve 3 array problems
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-25
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid task data
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to create task
 */
router.post('/create', authMiddleware.authUser, createTask);
/**
 * @swagger
 * /api/task/getTask:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - in-progress
 *             - completed
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search tasks by title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - dueDate
 *             - createdAt
 *             - priority
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch tasks
 */
router.get('/getTask', authMiddleware.authUser, getTask);
/**
 * @swagger
 * /api/task/getTask/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6aad000f0b22a67662ccca51
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to fetch task
 */
router.get('/getTask/:id', authMiddleware.authUser, getTaskById);
/**
 * @swagger
 * /api/task/getTask/{id}:
 *   put:
 *     summary: Update task
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6aad000f0b22a67662ccca51
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete DSA
 *               description:
 *                 type: string
 *                 example: Solve 5 problems
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - in-progress
 *                   - completed
 *               priority:
 *                 type: string
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-09-25
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid task data
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to update task
 */
router.put('/getTask/:id', authMiddleware.authUser, updateTask);
/**
 * @swagger
 * /api/task/getTask/{id}:
 *   delete:
 *     summary: Delete task
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6aad000f0b22a67662ccca51
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to delete task
 */
router.delete('/getTask/:id', authMiddleware.authUser, deleteTask);
/**
 * @swagger
 * /api/task/overdue:
 *   get:
 *     summary: Get overdue tasks
 *     tags:
 *       - Task
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue tasks fetched successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to fetch overdue tasks
 */
router.get('/overdue', authMiddleware.authUser, getOverdueTasks);
module.exports=router;
