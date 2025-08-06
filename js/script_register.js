document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "login.html";
    }, 500);
    });

    
});
