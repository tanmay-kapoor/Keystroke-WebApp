let token = localStorage.getItem("token");
if (!token) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    token = params.token;
    localStorage.setItem("token", token);
}
