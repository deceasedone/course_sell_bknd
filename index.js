require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
  try {
      await mongoose.connect(MONGO_URL);
      console.log("Connected to the database");
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
  } catch(e) {
      console.error("Failed to connect to the database", e);
  }
}

main();
