const express = require("express");
const data = require("./data.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const crypto = require("crypto");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
const database = require("./database");
// app.use("/static", express.static(path.join(__dirname, "public")));

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
  database
    .any("SELECT * from schedule;")
    .then((usersSchedule) => {
      res.render("pages/schedules", {
        schedule: usersSchedule,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("pages/error", {
        err: err,
      });
    });
});

app.get("/schedules", (req, res) => {
  // const schList = data.schedules;
  // const usersList = data.users;
  database.any("SELECT * from schedule;").then((usersSchedule) => {
    res
      .render("pages/schedules", {
        schedule: usersSchedule,
        // schList: schList,
        // usersList: usersList,
      })
      .catch((err) => {
        res.render("/pages/error", {
          err: err,
        });
      });
  });
});

app.get("/users/:userid(\\d+)/", (req, res) => {
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

app.get("/users/new", (req, res) => {
  res.render("pages/usersnew");
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

app.get("/schedules/new", (req, res) => {
  const usersList = data.users;

  res.render("pages/schnew", {
    usersList: usersList,
    // userId: userId,
  });
});

app.post("/schedules", (req, res) => {
  const newSchedule = {
    user_id: req.body.user_id,
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  };
  data.schedules.push(newSchedule);
  res.redirect("/schedules");
});
