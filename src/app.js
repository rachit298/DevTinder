const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("This is the test path '/test'");
})

app.use("/hello", (req, res) => {
    res.send("This is the hello path '/hello'");
})

app.use("/", (req, res) => {
    res.send("This is the base path '/'");
})

app.listen(1234, () => {
    console.log("Server is listening at port 1234.");
});