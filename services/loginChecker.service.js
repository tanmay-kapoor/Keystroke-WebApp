let loggedIn = false;

const checkLoggedIn = () => {
    if (loggedIn) {
        return true;
    } else {
        return false;
    }
};

const setLoggedIn = (value) => {
    loggedIn = value;
};

module.exports = { checkLoggedIn, setLoggedIn };
