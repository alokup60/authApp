const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4001;

app.use(express.json());

require("./config/databse").connect();

//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//activate server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
