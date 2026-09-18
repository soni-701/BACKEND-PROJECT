const Task = require('../models/task.model');

async function createTask(req, res) {
    try {
        const userId = req.user._id;

        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        // 1. Title validation
        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        // 2. Status validation
        const allowedStatus = [
            "pending",
            "in-progress",
            "completed"
        ];

        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        // 3. Priority validation
        const allowedPriority = [
            "low",
            "medium",
            "high"
        ];

        if (priority && !allowedPriority.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        // 4. Due date validation
        if (dueDate && isNaN(Date.parse(dueDate))) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        // 5. Create task
        const task = await Task.create({
            title: title.trim(),
            description,
            status,
            priority,
            dueDate,
            user: userId
        });

        return res.status(201).json({
            message: "Task Created successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to create task"
        });
    }
}

async function getTask(req, res) {
    try {
        const userId = req.user._id;
        const status = req.query.status;
        const priority = req.query.priority;
        const search = req.query.search;
        const sort=req.query.sort;

        let filter = { user: userId };

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

               // Sorting
        let sortOption = {};

        if (sort === "dueDate") {
            sortOption.dueDate = 1;
        } else if (sort === "createdAt") {
            sortOption.createdAt = 1;
        } else if (sort === "priority") {
            sortOption.priority = 1;
        }

        //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // counting all matching tasks
        const totalTasks = await Task.countDocuments(filter);

        const totalPages = Math.ceil(totalTasks / limit);

        const tasks = await Task.find(filter)
            .sort(sortOption)
            .skip(skip)
             .limit(limit);

        return res.status(200).json({
         message: "task fetched successfully",
         tasks,
         pagination: {
        currentPage: page,
        limit: limit,
        totalTasks: totalTasks,
        totalPages: totalPages
         }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch task"
        });
    }
}

async function getTaskById(req, res) {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findOne({
            _id: taskId,
            user: userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch task"
        });
    }
}

async function updateTask(req, res) {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const { title, description, dueDate, status, priority } = req.body;

        const task = await Task.findOne({
            _id: taskId,
            user: userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task is not found"
            });
        }

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.dueDate = dueDate ?? task.dueDate;
        task.status = status ?? task.status;
        task.priority = priority ?? task.priority;

        await task.save();

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Task is not updating"
        });
    }
}


async function deleteTask(req, res) {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findOneAndDelete({
            _id: taskId,
            user: userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully",
            task
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to delete task"
        });
    }
}


async function getOverdueTasks(req, res) {
    try {
        const userId = req.user._id;

        const today = new Date();

        const tasks = await Task.find({
            user: userId,
            dueDate: { $lt: today },
            status: { $ne: "completed" }
        });

        return res.status(200).json({
            message: "Overdue tasks fetched successfully",
            tasks
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch overdue tasks"
        });
    }
}


module.exports={createTask,getTask,getTaskById,updateTask,deleteTask,getOverdueTasks};