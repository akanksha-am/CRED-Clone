const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//for swagger documentation
const swaggerui = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocument));

const ErrorHandler = require("./middleware/errorHandler");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());

const userRoute = require("./routes/user");
const cardRoute = require("./routes/card");
const reminder = require("./utils/reminder");

app.use("/api/user", userRoute);
app.use("/api/cards", cardRoute);

app.use("/", (req, res) => {
  res.send("Welcome to the backend of Cred Clone");
});

app.use(ErrorHandler);

reminder();

// Wildcard route to handle any other requests
app.all("*", (req, res) => {
  res.status(404).send("Page not found");
});

module.exports = app;
