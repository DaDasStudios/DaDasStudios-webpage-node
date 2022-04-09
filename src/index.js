const app = require("./app");

function onServing() {
    console.log(`Server on port ${app.get("port")}`);
}

app.listen(app.get("port"), onServing);