const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("./models/user");

const {
    sendWelcomeEmail,
    sendResetPasswordEmail
} = require("./emailservice");

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        console.log("REGISTER EMAIL:", email);


        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = await User.create({

            name,
            email,
            password: hashedPassword

        });


        res.status(201).json({

            message: "Account created successfully",

            userId: user._id

        });


        // Welcome email
        sendWelcomeEmail(user.name, user.email)

            .then(() => {

                console.log(
                    "Welcome email sent ✅"
                );

            })

            .catch((error) => {

                console.error(
                    "Welcome email failed ❌",
                    error.message
                );

            });


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        const user =
            await User.findOne({ email });


        if (!user) {

            return res.status(400).json({

                message:
                    "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({

                message:
                    "Invalid email or password"

            });

        }


        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        res.json({

            message: "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

});


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post("/forgot-password", async (req, res) => {

    try {

        console.log("FORGOT PASSWORD API HIT ✅");
        console.log("REQUEST BODY:", req.body);

        const { email } = req.body;
        if (!email) {

            return res.status(400).json({

                message: "Email is required"

            });

        }


        const user =
            await User.findOne({ email });


        // Don't reveal whether email exists
        if (!user) {

            return res.json({

                message:
                    "If this email is registered, a password reset link has been sent."

            });

        }


        // Generate secure reset token
        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // Token expires after 15 minutes
        const resetTokenExpiry =
            new Date(
                Date.now() + 15 * 60 * 1000
            );


        user.resetPasswordToken =
            resetToken;

        user.resetPasswordExpires =
            resetTokenExpiry;


        await user.save();


        // Vercel frontend
        const frontendUrl =
            "https://job-track-fronted.vercel.app";


        const resetLink =
            `${frontendUrl}/reset-password.html?token=${resetToken}`;


        console.log(
            "PASSWORD RESET LINK:",
            resetLink
        );


        // Send reset email
        await sendResetPasswordEmail(
            user.email,
            resetLink
        );


        res.json({

            message:
                "If this email is registered, a password reset link has been sent."

        });


    } catch (error) {

        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Unable to process password reset request"

        });

    }

});


// =====================================================
// RESET PASSWORD
// =====================================================

router.post("/reset-password", async (req, res) => {

    try {

        const {
            token,
            password
        } = req.body;


        if (!token || !password) {

            return res.status(400).json({

                message:
                    "Token and new password are required"

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                message:
                    "Password must be at least 6 characters"

            });

        }


        const user =
            await User.findOne({

                resetPasswordToken: token,

                resetPasswordExpires: {
                    $gt: new Date()
                }

            });


        if (!user) {

            return res.status(400).json({

                message:
                    "Password reset link is invalid or has expired"

            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        user.password =
            hashedPassword;


        // Remove used reset token
        user.resetPasswordToken = null;

        user.resetPasswordExpires = null;


        await user.save();


        res.json({

            message:
                "Password reset successfully. You can now login."

        });


    } catch (error) {

        console.error(
            "RESET PASSWORD ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Unable to reset password"

        });

    }

});


// =====================================================
// GET TOTAL USERS
// =====================================================

router.get("/count", async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();


        res.json({

            totalUsers

        });


    } catch (error) {

        console.error(
            "User Count Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to get user count"

        });

    }

});


module.exports = router;