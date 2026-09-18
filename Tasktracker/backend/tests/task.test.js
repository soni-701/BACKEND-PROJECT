const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const connectDB = require("../src/db/db");

const User = require("../src/models/user.model");
const Task = require("../src/models/task.model");

jest.setTimeout(15000);

beforeAll(async () => {
    require("dotenv").config();
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});


describe("AUTHENTICATION API",()=>{
    test("Create task with valid token", async () => {

    const email = `task${Date.now()}@example.com`;
    const password = "password123";

    // Create user
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "TaskTestUser",
            email,
            password
        });

    // Login
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    // Create task
    const response = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Test Task",
            description: "Testing task creation",
            priority: "high",
            status: "pending"
        });

    expect(response.statusCode).toBe(201);

    expect(response.body.message)
        .toBe("Task Created successfully");

    expect(response.body.task)
        .toBeDefined();

    expect(response.body.task.title)
        .toBe("Test Task");

    // Cleanup
    await User.deleteOne({ email });
    await Task.deleteOne({ title: "Test Task" });
    });

    test("Get all tasks with valid token", async () => {

    const email = `gettask${Date.now()}@example.com`;
    const password = "password123";

    // Create user
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "GetTaskUser",
            email,
            password
        });

    // Login
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    // Create a task
    await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Get Task Test",
            description: "Testing get all tasks",
            priority: "medium",
            status: "pending"
        });

    // Get all tasks
    const response = await request(app)
        .get("/api/task/getTask")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("task fetched successfully");

    expect(response.body.tasks)
        .toBeDefined();

    expect(Array.isArray(response.body.tasks))
        .toBe(true);

    expect(response.body.tasks.length)
        .toBeGreaterThan(0);

    // Cleanup
    await User.deleteOne({ email });
});

    test("Get task by ID with valid token", async () => {

    const email = `getbyid${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
        .post("/api/auth/register")
        .send({
            username: "GetByIdUser",
            email,
            password
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    const createResponse = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Get By ID Test",
            description: "Testing get task by ID",
            priority: "high",
            status: "pending"
        });

    const taskId = createResponse.body.task._id;

    const response = await request(app)
        .get(`/api/task/getTask/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("Task fetched successfully");

    expect(response.body.task)
        .toBeDefined();

    expect(response.body.task._id)
        .toBe(taskId);

    expect(response.body.task.title)
        .toBe("Get By ID Test");

    await User.deleteOne({ email });
    await Task.deleteOne({ _id: taskId });
});

test("Update task with valid token", async () => {

    const email = `update${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
        .post("/api/auth/register")
        .send({
            username: "UpdateTaskUser",
            email,
            password
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    const createResponse = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Old Task Title",
            description: "Old description",
            priority: "low",
            status: "pending"
        });

    const taskId = createResponse.body.task._id;

    const response = await request(app)
        .put(`/api/task/getTask/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Task Title",
            status: "completed",
            priority: "high"
        });

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("Task updated successfully");

    expect(response.body.task)
        .toBeDefined();

    expect(response.body.task.title)
        .toBe("Updated Task Title");

    expect(response.body.task.status)
        .toBe("completed");

    expect(response.body.task.priority)
        .toBe("high");

    await User.deleteOne({ email });
    await Task.deleteOne({ _id: taskId });
});

test("Delete task with valid token", async () => {

    const email = `delete${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
        .post("/api/auth/register")
        .send({
            username: "DeleteTaskUser",
            email,
            password
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    const createResponse = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Delete Test Task",
            description: "Testing task deletion",
            priority: "medium",
            status: "pending"
        });

    const taskId = createResponse.body.task._id;

    const response = await request(app)
        .delete(`/api/task/getTask/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("Task deleted successfully");

    const deletedTask = await Task.findById(taskId);

    expect(deletedTask).toBeNull();

    await User.deleteOne({ email });
});

test("User cannot access another user's task", async () => {

    const userAEmail = `userA${Date.now()}@example.com`;
    const userBEmail = `userB${Date.now()}@example.com`;
    const password = "password123";

    // Create User A
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "UserA",
            email: userAEmail,
            password
        });

    // Create User B
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "UserB",
            email: userBEmail,
            password
        });

    // Login User A
    const loginA = await request(app)
        .post("/api/auth/login")
        .send({
            email: userAEmail,
            password
        });

    // Login User B
    const loginB = await request(app)
        .post("/api/auth/login")
        .send({
            email: userBEmail,
            password
        });

    const tokenA = loginA.body.token;
    const tokenB = loginB.body.token;

    // User A creates a task
    const createResponse = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
            title: "User A Private Task",
            description: "This belongs to User A",
            priority: "high",
            status: "pending"
        });

    const taskId = createResponse.body.task._id;

    // User B tries to access User A's task
    const response = await request(app)
        .get(`/api/task/getTask/${taskId}`)
        .set("Authorization", `Bearer ${tokenB}`);

    expect(response.statusCode).toBe(404);

    expect(response.body.message)
        .toBe("Task not found");

    // Cleanup
    await User.deleteMany({
        email: { $in: [userAEmail, userBEmail] }
    });

    await Task.deleteOne({ _id: taskId });
});


test("Get overdue tasks with valid token", async () => {

    const email = `overdue${Date.now()}@example.com`;
    const password = "password123";

    // Create user
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "OverdueUser",
            email,
            password
        });

    // Login
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    const token = loginResponse.body.token;

    // Create an overdue task
    const createResponse = await request(app)
        .post("/api/task/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Overdue Test Task",
            description: "Testing overdue tasks",
            priority: "high",
            status: "pending",
            dueDate: "2025-01-01"
        });

    const taskId = createResponse.body.task._id;

    // Get overdue tasks
    const response = await request(app)
        .get("/api/task/overdue")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("Overdue tasks fetched successfully");

    expect(response.body.tasks)
        .toBeDefined();

    expect(Array.isArray(response.body.tasks))
        .toBe(true);

    expect(
        response.body.tasks.some(task => task._id === taskId)
    ).toBe(true);

    // Cleanup
    await User.deleteOne({ email });
    await Task.deleteOne({ _id: taskId });
});

})