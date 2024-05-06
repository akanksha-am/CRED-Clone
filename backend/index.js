const app = require("./app");
require("dotenv").config();
const connectwithDb = require("./config/db");

//connect with database
connectwithDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT}`);
});
