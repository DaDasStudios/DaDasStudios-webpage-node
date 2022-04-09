module.exports = function queryPromise(err) {
    return new Promise((resolve, reject) => {
        if (err) reject(err);
        else resolve("Success");
    });
};