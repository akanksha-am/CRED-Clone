const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.send("Welcome to the backend of Cred Clone");
});

module.exports = app;
