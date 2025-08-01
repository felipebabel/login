


document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("btn3").addEventListener("click", (event) => {
        document.body.classList.add("fade-out");
          setTimeout(() => {
        window.location.href = "index.html";
    }, 500);
    });

    
});
