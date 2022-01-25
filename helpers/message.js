let message;

const getMessage = () => {
    const msg = message;
    setMessage(undefined);
    return msg;
};

const setMessage = (text) => {
    message = text;
};

module.exports = { getMessage, setMessage };
