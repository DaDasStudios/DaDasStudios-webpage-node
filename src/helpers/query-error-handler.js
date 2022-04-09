module.exports = function handleError(err, success) {
    if (err) console.log(err);
    else success();
};