let toggle = document.querySelector(".toggle");
let text = document.querySelector(".text");

let form = document.getElementById("change");

//forms

function Animatedtoggle() {
    toggle.classList.toggle("active");

    if (toggle.classList.contains("active")) {
        text.innerHTML = "Admin";
        openAdminLoginPage(); // Call the function to open adminLogin.html
    } else {
        text.innerHTML = "User";
    }
}

function openAdminLoginPage() {
    window.location.href = 'adminLogin.html';
}