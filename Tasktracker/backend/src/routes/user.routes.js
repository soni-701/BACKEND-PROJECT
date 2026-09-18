const express= require('express');
const { registerUser ,loginUser,getProfile, updateProfile, changePassword,forgetPassword, resetPassword} = require('../controllers/user.controller');
const authMiddleware=require('../middleware/auth.middleware');
const {loginLimiter} = require('../middleware/rateLimit.middleware');
const router=express.Router();



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Soni
 *               email:
 *                 type: string
 *                 example: soni@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post('/register', registerUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: soniya@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User login successfully
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Failed to login
 */
router.post('/login', loginLimiter,loginUser);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Authentication token is required or invalid
 *       500:
 *         description: Failed to fetch profile
 */
router.get('/profile', authMiddleware.authUser, getProfile);
/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: sanvi
 *               email:
 *                 type: string
 *                 example: sanvi@gmail.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Username or email is required or invalid email format
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Failed to update profile
 */
router.put('/profile', authMiddleware.authUser, updateProfile);
/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password and new password are required, or new password is too short
 *       401:
 *         description: Authentication required or current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to change password
 */
router.put('/change-password',authMiddleware.authUser,changePassword);
/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Generate password reset token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: sanvi@gmail.com
 *     responses:
 *       200:
 *         description: Password reset token generated successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to process forgot password
 */
router.post('/forget-password', forgetPassword);
/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *         example: 7f8a9b123456abcdef
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: New password is required, password is too short, or token is invalid/expired
 *       500:
 *         description: Failed to reset password
 */
router.post('/reset-password/:token', resetPassword);

module.exports=router;