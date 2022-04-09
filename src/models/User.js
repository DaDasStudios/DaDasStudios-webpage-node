const uniqid = require("uniqid");

class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
    showUser() {
        console.table(this);
    }

    getValues() {
        return `'${uniqid()}', '${this.username}', '${this.email}', '${
      this.password
    }'`;
    }
}

module.exports = User;