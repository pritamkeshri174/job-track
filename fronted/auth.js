// =====================================================
// JOBTRACK FRONTEND AUTH
// =====================================================

const API_URL = "https://job-track-lpy1.onrender.com/api/auth";


// =====================================================
// REGISTER
// =====================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match ❌");
            return;
        }

        const submitButton =
            registerForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";

        try {

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Registration failed ❌"
                );

                submitButton.disabled = false;
                submitButton.textContent = "Create Account";

                return;
            }

            alert("Account created successfully 🎉");

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration Error:", error);

            alert("Server connection failed ❌");

            submitButton.disabled = false;
            submitButton.textContent = "Create Account";
        }

    });
}


// =====================================================
// LOGIN
// =====================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const submitButton =
            loginForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                alert(
                    data.message ||
                    "Login failed ❌"
                );

                submitButton.disabled = false;
                submitButton.textContent = "Login";

                return;
            }

            localStorage.setItem(
                "jobtrackToken",
                data.token
            );

            localStorage.setItem(
                "jobtrackUser",
                JSON.stringify(data.user)
            );

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login Error:", error);

            alert("Server connection failed ❌");

            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }

    });
}


// =====================================================
// PASSWORD SHOW / HIDE
// =====================================================

function togglePassword(inputId, button) {

    const passwordInput =
        document.getElementById(inputId);

    if (!passwordInput) {
        return;
    }

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        button.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        button.textContent = "Show";
    }
}


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

if (forgotPasswordForm) {

    forgotPasswordForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const email =
                document.getElementById("forgotEmail")
                    .value.trim();

            const message =
                document.getElementById("forgotMessage");

            const submitButton =
                forgotPasswordForm.querySelector(
                    "button[type='submit']"
                );

            if (!email) {

                message.textContent =
                    "Please enter your email address.";

                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
            message.textContent = "";

            try {

                const response =
                    await fetch(
                        `${API_URL}/forgot-password`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email
                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Unable to send reset link.";

                    submitButton.disabled = false;
                    submitButton.textContent =
                        "Send Reset Link";

                    return;
                }

                message.textContent =
                    "If this email is registered, a password reset link has been sent. Please check your email.";

                submitButton.textContent =
                    "Email Sent ✓";

            } catch (error) {

                console.error(
                    "Forgot Password Error:",
                    error
                );

                message.textContent =
                    "Server connection failed ❌";

                submitButton.disabled = false;
                submitButton.textContent =
                    "Send Reset Link";
            }
        }
    );
}