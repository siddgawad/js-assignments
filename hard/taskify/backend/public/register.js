const token = localStorage.getItem("token");
if (token) {
  window.location.href = "/index.html"; // Redirect if already logged in
}

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const feedback = document.getElementById("feedback");

  // Reset any previous feedback
  resetFeedback();

  // ✅ Email validation - more comprehensive approach
  // This allows any standard email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(username)) {
    showError("Please enter a valid email address.");
    return;
  }

  // ✅ Password strength validation with visual feedback
  const passwordStrength = checkPasswordStrength(password);
  if (passwordStrength !== "strong") {
    showError("Password must be at least 8 characters and include: an uppercase letter, a number, and a special character.");
    highlightPasswordRequirements(password);
    return;
  }

  // ✅ Show loading state
  const submitButton = document.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = "Creating account...";
  submitButton.disabled = true;

  // ✅ Proceed to register
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("token", result.token);
      showSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);
    } else {
      showError(result.message || "Registration failed. Please try again.");
    }
  } catch (err) {
    console.error("Registration failed:", err);
    showError("Connection error. Please check your internet and try again.");
  } finally {
    // Restore button state
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
});

function checkPasswordStrength(password) {
  // Define strength criteria
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Count how many criteria are met
  const strengthScore = [hasMinLength, hasUpperCase, hasNumber, hasSpecialChar]
    .filter(Boolean).length;
  
  // Return strength rating
  if (strengthScore <= 2) return "weak";
  if (strengthScore === 3) return "medium";
  return "strong";
}

function highlightPasswordRequirements(password) {
  // Update the requirements checklist based on what's missing
  document.getElementById("req-length").classList.toggle("met", password.length >= 8);
  document.getElementById("req-uppercase").classList.toggle("met", /[A-Z]/.test(password));
  document.getElementById("req-number").classList.toggle("met", /\d/.test(password));
  document.getElementById("req-special").classList.toggle("met", /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));
  
  // Make the requirements visible
  document.getElementById("password-requirements").style.display = "block";
}

function showError(message) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = "error-message";
  feedback.style.display = "block";
}

function showSuccess(message) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = "success-message";
  feedback.style.display = "block";
}

function resetFeedback() {
  const feedback = document.getElementById("feedback");
  feedback.textContent = "";
  feedback.style.display = "none";
  document.getElementById("password-requirements").style.display = "none";
}

// Add live password strength feedback
document.getElementById("password").addEventListener("input", function() {
  const password = this.value;
  const strength = checkPasswordStrength(password);
  
  // Update strength indicator
  const strengthIndicator = document.getElementById("password-strength");
  strengthIndicator.className = `strength-${strength}`;
  strengthIndicator.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
  
  // Update requirements checklist
  highlightPasswordRequirements(password);
});