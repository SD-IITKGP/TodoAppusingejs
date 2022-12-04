const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(express.static("public"));
var data = [];
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  };
  var day = new Date().toLocaleDateString("en-US", options);
  res.render("weekday", { dayOfWeek: day, newItem: data });
});
app.post("/", function (req, res) {
  data.push(req.body.todoinput);
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server is running at port 3000");
});
