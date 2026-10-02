const nodemailer = require("nodemailer");


// ========================================
// GMAIL TRANSPORTER
// ========================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
});

// ========================================
// SEND WELCOME EMAIL
// ========================================

const sendWelcomeEmail = async (name, email) => {

    try {

        await transporter.sendMail({

            from: `"JobTrack" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Welcome to JobTrack 🎉",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                ">

                    <h2>
                        Welcome to JobTrack, ${name}! 🎉
                    </h2>

                    <p>
                        Your JobTrack account has been
                        registered successfully.
                    </p>

                    <p>
                        You can now login and start
                        tracking your job applications.
                    </p>

                    <br>

                    <p>
                        Thank you for joining JobTrack!
                    </p>

                    <p>
                        <strong>— JobTrack Team</strong>
                    </p>

                </div>
            `

        });

        console.log(
            "Welcome email sent successfully to:",
            email
        );

    } catch (error) {

        console.error(
            "Welcome Email Error:",
            error.message
        );

        throw error;
    }

};


// ========================================
// SEND PASSWORD RESET EMAIL
// ========================================

const sendResetPasswordEmail = async (
    email,
    resetLink
) => {

    try {

        await transporter.sendMail({

            from: `"JobTrack" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: "Reset Your JobTrack Password 🔐",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">

                    <h2>
                        Password Reset Request 🔐
                    </h2>

                    <p>
                        We received a request to reset
                        your JobTrack account password.
                    </p>

                    <p>
                        Click the button below to
                        create a new password:
                    </p>

                    <br>

                    <a
                        href="${resetLink}"
                        style="
                            display: inline-block;
                            padding: 12px 24px;
                            background: #2563eb;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                        "
                    >
                        Reset Password
                    </a>

                    <br><br>

                    <p>
                        This password reset link will
                        expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request a password
                        reset, you can safely ignore this email.
                    </p>

                    <br>

                    <p>
                        <strong>— JobTrack Team</strong>
                    </p>

                </div>
            `

        });

        console.log(
            "Password reset email sent successfully to:",
            email
        );

    } catch (error) {

        console.error(
            "Password Reset Email Error:",
            error.message
        );

        throw error;
    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {
    sendWelcomeEmail,
    sendResetPasswordEmail
};
transporter.verify((error, success) => {
    if (error) {
        console.error("GMAIL CONNECTION ERROR:", error);
    } else {
        console.log("Gmail SMTP is ready ✅");
    }
});