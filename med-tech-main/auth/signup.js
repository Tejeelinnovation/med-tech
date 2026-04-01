// elements
const form = document.getElementById("signup-form");
const message = document.getElementById("message");
const btn = document.getElementById("signup-btn");

// form submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // ✅ validation
    if (!name || !email || !password) {
        message.textContent = "Please fill all fields";
        message.style.color = "red";
        return;
    }

    try {
        // ✅ loading state
        if (btn) {
            btn.textContent = "Creating...";
            btn.disabled = true;
        }

        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await res.json();

        if (res.ok) {
            message.textContent = "Signup successful 🎉 Redirecting...";
            message.style.color = "green";

            // ✅ redirect
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            message.textContent = data.message || "Signup failed";
            message.style.color = "red";
        }

    } catch (error) {
        console.error("Signup Error:", error);
        message.textContent = "Something went wrong ❌";
        message.style.color = "red";
    }

    // ✅ reset button
    if (btn) {
        btn.textContent = "Sign Up";
        btn.disabled = false;
    }
});


//  GOOGLE LOGIN (OPTIONAL)
function googleLogin() {
    // NextAuth Google login trigger
    window.location.href = "http://localhost:3000/api/auth/signin/google";
}