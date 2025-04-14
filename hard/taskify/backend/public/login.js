const token = localStorage.getItem("token");
if (token) {
    window.location.href = "http://localhost:3000/index.html";
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await res.json();

  if (res.ok) {
    localStorage.setItem("token", result.token);
    alert("Login successful!");
    window.location.href = "/index.html";
  } else {
    alert("Error: " + result.message);
  }
});
