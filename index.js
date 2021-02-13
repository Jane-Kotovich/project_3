const express = require("express");
const data = require("./data.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
const crypto = require("crypto");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log("server listening on port 3000");
});
app.get("/", (req, res) => {
  res.send("Welcome to our schedule website");
});

app.get("/users", (req, res) => {
  res.json(data.users);
});

app.get("/schedules", (req, res) => {
  res.json(data.schedules);
});

app.get("/users/:userid", (req, res) => {
  // console.log(data.users[req.params.userid]);
  res.json(data.users[req.params.userid]);
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
  res.json(results);
});

app.post("/users", (req, res) => {
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
});

//project b
