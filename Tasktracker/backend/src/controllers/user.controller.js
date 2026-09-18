const User=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to register user"
        });
    }
}


async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passvalid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passvalid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "User login successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to login"
        });
    }
}

async function getProfile(req, res) {
    try {
        const user = req.user;

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch profile"
        });
    }
}


async function updateProfile(req, res) {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({
                message: "Username or email is required"
            });
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Invalid email format"
                });
            }

            const existingUser = await User.findOne({
                email,
                _id: { $ne: req.user._id }
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (username) {
            user.username = username;
        }

        if (email) {
            user.email = email;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
}

async function changePassword(req, res) {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to change password"
        });
    }
}

async function forgetPassword(req,res){
try {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
                message: "Email is required"
        }); 
    }
    const user =await User.findOne({email});
    if(!user){
        return res.status(404).json({
                message: "User not found"
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    return res.status(200).json({
        message: "Password reset token generated successfully",
        resetToken
    });

} catch (error) {
    console.log(error);

    return res.status(500).json({
            message: "Failed to process forgot password"
    });
}
}


async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        // Token ko invalidate kar do
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to reset password"
        });
    }
}

module.exports={registerUser,loginUser,getProfile,updateProfile,changePassword,forgetPassword,resetPassword};