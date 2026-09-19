const Student = require('../models/stud.model');

async function createStudent(req, res) {
    try {
        const {
            name,
            email,
            rollNo,
            branch,
            age,
            course,
            semester,
            phone
        } = req.body;

        // Name required
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        // Name validation
        if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(name.trim())) {
            return res.status(400).json({
                message: "Name must contain only letters and spaces"
            });
        }

        // Email required
        if (!email || email.trim() === "") {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Roll number required
        if (rollNo === undefined || rollNo === null) {
            return res.status(400).json({
                message: "RollNo is required"
            });
        }

        // Roll number validation
        if (typeof rollNo !== "number" || rollNo <= 0) {
            return res.status(400).json({
                message: "RollNo must be a positive number"
            });
        }

        const student = await Student.create({
            name: name.trim(),
            email: email.trim(),
            branch,
            rollNo,
            age,
            course,
            semester,
            phone
        });

        return res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

async function getStudent(req,res){
const name=req.query.body;
const email=req.query.body;
const rollno=req.query._id;
const branch=req.query.body;


}

module.exports = { createStudent ,getStudent };