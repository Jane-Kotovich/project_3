const express = require("express");

const index = express();
const PORT = 3000;
const data = require("./data.js");
index.listen(PORT, () => {
  console.log("server listening on port 3000");
});
index.get("/", (req, res) => {
  res.send("Welcome to our schedule website");
});

index.get("/users", (req, res) => {
  res.json(data.users);
});

index.get("/schedules", (req, res) => {
  res.json(data.schedules);
});

index.get("/users/:userid", (req, res) => {
  res.json(data.users[req.params.userid]);
});

index.get("/users/:userid/schedules", (req, res) => {
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
