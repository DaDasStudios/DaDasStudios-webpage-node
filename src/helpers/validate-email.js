module.exports = {
    validateEmail(dbConnection, email) {
        let isRegistered = false;
        dbConnection.query(
            "SELECT * FROM users WHERE email = ?", [email],
            (err, result) => {
                if (!result) isRegistered = false;
                else isRegistered = true;
            }
        );
        return isRegistered;
    },
};