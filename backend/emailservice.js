const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


// ========================================
// SEND WELCOME EMAIL
// ========================================

const sendWelcomeEmail = async (name, email) => {

    const { data, error } = await resend.emails.send({

        from: "JobTrack <onboarding@resend.dev>",

        to: [email],

        subject: "Welcome to JobTrack 🎉",

        html: `
            <h2>Welcome to JobTrack, ${name}! 🎉</h2>

            <p>Your JobTrack account has been registered successfully.</p>

            <p>
                You can now login and start tracking
                your job applications.
            </p>

            <br>

            <p>Thank you for joining JobTrack!</p>

            <p>
                <strong>— JobTrack Team</strong>
            </p>
        `
    });


    if (error) {
        throw new Error(error.message);
    }

    console.log(
        "Welcome email sent successfully:",
        data.id
    );
};


// ========================================
// SEND PASSWORD RESET EMAIL
// ========================================

const sendResetPasswordEmail = async (email, resetLink) => {

    const { data, error } = await resend.emails.send({

        from: "JobTrack <onboarding@resend.dev>",

        to: [email],

        subject: "Reset Your JobTrack Password 🔐",

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>Password Reset Request 🔐</h2>

                <p>
                    We received a request to reset your
                    JobTrack account password.
                </p>

                <p>
                    Click the button below to create a
                    new password:
                </p>

                <br>

                <a
                    href="${resetLink}"
                    style="
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #2563eb;
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
                    This password reset link will expire
                    in 15 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <br>

                <p>
                    <strong>— JobTrack Team</strong>
                </p>

            </div>
        `
    });


    if (error) {
        throw new Error(error.message);
    }

    console.log(
        "Password reset email sent successfully:",
        data.id
    );
};


// ========================================
// EXPORT BOTH FUNCTIONS
// ========================================

module.exports = {
    sendWelcomeEmail,
    sendResetPasswordEmail
};