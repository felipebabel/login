document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("logout-btn").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "login.html";
    }, 500);
    });

    document.getElementById("auth-settings-btn").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "authentication_settings.html";
    }, 500);
    });

    
});
