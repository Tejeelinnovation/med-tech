const form = document.getElementById("login-form");
const message = document.getElementById("message");
const btn = document.getElementById("login-btn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        message.textContent = "Please fill all fields";
        message.style.color = "red";
        return;
    }

    try {
        btn.textContent = "Logging in...";
        btn.disabled = true;

        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (res.ok) {

            // ✅ FINAL FIX
            localStorage.setItem("userEmail", data.user.email);
            localStorage.setItem("userRole", data.user.role);
            localStorage.setItem("userName", data.user.name);

            console.log("SAVED EMAIL:", localStorage.getItem("userEmail"));

            message.textContent = "Login successful ✅";
            message.style.color = "green";

            if (data.user.role === "admin") {
                window.location.href =
                    "http://localhost:3000/admin?role=admin&name=" +
                    encodeURIComponent(data.user.name);
            } else {
                window.location.href = "../index.html";
            }

        } else {
            message.textContent = data.message || "Invalid credentials";
            message.style.color = "red";
        }

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        message.textContent = "Error logging in ❌";
        message.style.color = "red";
    }

    btn.textContent = "Login";
    btn.disabled = false;
});

function googleLogin() {
    window.location.href = "http://localhost:3000/api/auth/signin/google";
}