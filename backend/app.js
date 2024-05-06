const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//for swagger documentation
const swaggerui = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());

// importing routes
const userRoute = require("./routes/user");
// const cardRoute = require("./routes/card");
// const rewardRoute = require("./routes/reward");

// Routes middlewares
app.use("/api/user", userRoute);
// app.use("/api/cards", cardRoute);
// app.use("/api/rewards", rewardRoute);

app.use("/", (req, res) => {
  res.send("Welcome to the backend of Cred Clone");
});

// Wildcard route to handle any other requests
app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = app;
