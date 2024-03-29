const showPasswordButton = document.getElementById("show-password");
const icon = showPasswordButton.children[0];
const password = document.getElementsByName("password")[0];

showPasswordButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (password.getAttribute("type") === "password") {
        password.setAttribute("type", "text");
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        password.setAttribute("type", "password");
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
});

document.getElementsByName("password")[0].addEventListener("keypress", (e) => {
    if (e.key.toLowerCase() === "enter") {
        e.preventDefault();
        const button = window.location.href.split("/")[3];
        document.getElementsByClassName(button)[0].click();
    }
});
