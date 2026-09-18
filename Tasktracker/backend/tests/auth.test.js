const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const connectDB = require("../src/db/db");
const User = require("../src/models/user.model");
const bcrypt =require('bcryptjs');

jest.setTimeout(15000);

beforeAll(async () => {
    require("dotenv").config();
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Authentication API", () => {

   test("Login should fail with wrong password", async () => {

    const email = `wrongpass${Date.now()}@example.com`;
    const password = "password123";

    // Create test user
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "WrongPasswordUser",
            email: email,
            password: password
        });

    // Try login with wrong password
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: email,
            password: "wrongpassword123"
        });

    expect(response.statusCode).toBe(401);

    expect(response.body.message)
        .toBe("Invalid email or password");

    // Cleanup
    await User.deleteOne({ email: email });
});


    test("Login should succeed with correct credentials", async () => {

    const email = `jesttest${Date.now()}@example.com`;
    const password = "password123";

    // Register test user
    const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
            username: "JestTestUser",
            email: email,
            password: password
        });

    expect(registerResponse.statusCode).toBe(201);

    // Login with same credentials
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: email,
            password: password
        });

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("User login successfully");

    expect(response.body.token)
        .toBeDefined();

    // Cleanup test user
    await User.deleteOne({ email: email });
});

test("Register should create a new user", async () => {

    const email = `register${Date.now()}@example.com`;
    const password = "password123";

    const response = await request(app)
        .post("/api/auth/register")
        .send({
            username: "RegisterTestUser",
            email: email,
            password: password
        });

    expect(response.statusCode).toBe(201);

    expect(response.body.message)
        .toBe("User registered successfully");

    expect(response.body.user)
        .toBeDefined();

    expect(response.body.user.email)
        .toBe(email);

    // Cleanup
    await User.deleteOne({ email: email });
});

test("Get profile with valid token", async () => {

    const email = `profile${Date.now()}@example.com`;
    const password = "password123";

    // Register user
    await request(app)
        .post("/api/auth/register")
        .send({
            username: "ProfileTestUser",
            email: email,
            password: password
        });

    // Login
    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: email,
            password: password
        });

    const token = loginResponse.body.token;

    // Get profile
    const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.message)
        .toBe("Profile fetched successfully");

    expect(response.body.user.email)
        .toBe(email);

    // Cleanup
    await User.deleteOne({ email: email });
});

test("Get profile without token", async () => {

    const response = await request(app)
        .get("/api/auth/profile");

    expect(response.statusCode).toBe(401);

    expect(response.body.message)
        .toBe("Authentication token is required");
});

});