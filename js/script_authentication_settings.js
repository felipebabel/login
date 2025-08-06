document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("go-back-btn").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "/html/user_session_summary.html";
    }, 500);
    });
});
