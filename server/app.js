const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const studentRoute = require("./routes/student");
const feeRoute = require("./routes/fee");

mongoose
  .connect(
    "mongodb+srv://Saikrishna_Institute:Achary143@cluster0.lcxjfeb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    // tempFileDir: "/tmp/",
  })
);

app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/student", studentRoute);
app.use("/fee", feeRoute);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

module.exports = app;
