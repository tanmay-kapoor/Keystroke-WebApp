const token = localStorage.getItem("token");
if (token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        Buffer.from(base64, "base64")
            .toString("utf8")
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    const exp = JSON.parse(jsonPayload).exp;

    if (Date.now() > exp * 1000) {
        localStorage.removeItem("token");
    } else {
        window.location = `/?token=${token}`;
    }
}
