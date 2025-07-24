document.querySelector("#login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msgBox = document.getElementById("message");

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        msgBox.style.color = "green";
        msgBox.textContent = `Welcome ${data.user.username}!`;
        setTimeout(() => {
          window.location.href = "account.html";
        }, 800);
      } else {
        msgBox.style.color = "red";
        msgBox.textContent = data.message || "Login failed.";
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      msgBox.style.color = "red";
      msgBox.textContent = "Server connection error.";
    });
});
