let clearStorage = false;

const getClearStorage = () => {
    const value = clearStorage;
    setClearStorage(false);
    return value;
};

const setClearStorage = (value) => {
    clearStorage = value;
};

module.exports = { getClearStorage, setClearStorage };
