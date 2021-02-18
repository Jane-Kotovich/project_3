const express = require("express");
const data = require("./data.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const crypto = require("crypto");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
const database = require("./database");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");

app.listen(PORT, () => {
  console.log("server listening on port 3000");
});
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home Page" });
});

app.get("/users", (req, res) => {
  const usersList = data.users;
  res.render("pages/users", {
    usersList: usersList,
    title: "Users list",
  });
});

app.get("/users/:userid(\\d+)/", (req, res) => {
  const userId = req.params.userid;
  const userIdInfo = data.users[req.params.userid];
  res.render("pages/userid", {
    userId: userId,
    userIdInfo: userIdInfo,
    title: "Exact user",
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
    title: "Schedule for choosen user",
  });
});

app.get("/users/new", (req, res) => {
  res.render("pages/usersnew", { title: "New user" });
});

app.post("/users", (req, res) => {
  const psw = req.body.password;
  const passwordEncr = crypto.createHash("sha256").update(psw).digest("hex");
  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: passwordEncr,
  };
  data.users.push(newUser);
  res.redirect("/users");
});

app.get("/schedules", (req, res) => {
  database
    .any("SELECT * from schedule;")
    .then((usersSchedule) => {
      res.render("pages/schedules", {
        schedule: usersSchedule,
        title: "List of all schedules",
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("pages/error", {
        err: err,
      });
    });
});

app.get("/schedules/new", (req, res) => {
  const usersList = data.users;
  res.render("pages/schnew", {
    usersList: usersList,
    title: "Add new schedule",
  });
});

app.post("/schedules", (req, res) => {
  const newSchedule = [
    req.body.firstname,
    req.body.lastname,
    req.body.week_day,
    req.body.start_time,
    req.body.end_time,
  ];

  const sql =
    "INSERT INTO schedule (firstname, lastname, week_day, start_time, end_time) VALUES ($1, $2, $3, $4, $5)";
  database
    .query(sql, newSchedule)
    .then((schedule) => {
      res.redirect("/schedules");
    })
    .catch((err) => {
      console.error(err);
      res.render("pages/error", {
        err: err,
      });
    });
});

// data.schedules.push(newSchedule);
// res.redirect("/schedules");
// });
