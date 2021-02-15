const express = require("express");
const data = require("./data.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const crypto = require("crypto");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log("server listening on port 3000");
});
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/users", (req, res) => {
  const usersList = data.users;
  res.render("pages/users", {
    usersList: usersList,
  });
});

app.get("/schedules", (req, res) => {
  const schList = data.schedules;
  const usersList = data.users;
  res.render("pages/schedules", {
    schList: schList,
    usersList: usersList,
  });
});

app.get("/users/:userid", (req, res) => {
  const userId = req.params.userid;
  const userIdInfo = data.users[req.params.userid];
  res.render("pages/userid", {
    userId: userId,
    userIdInfo: userIdInfo,
  });
});

app.get("/users/:userid/schedules", (req, res) => {
  const results = [];
  const userId = Number(req.params.userid);

  for (let i = 0; i < data.schedules.length; i++) {
    let schedule = data.schedules[i];
    if (schedule.user_id === userId) {
      //if (schedule["user_id"])
      results.push(schedule);
    }
  }
  const usersList = data.users;
  res.render("pages/schid", {
    results: results,
    usersList: usersList,
    userId: userId,
  });
});

app.post("/users/new", (req, res) => {
  console.log(req.body);
  const psw = req.body.password;
  const passwordEncr = crypto.createHash("sha256").update(psw).digest("hex");
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: passwordEncr,
  };
  console.log(newUser);
  console.log(data.users.push(newUser));
  res.send("It's working");
  res.render("pages/usersnew");
});
