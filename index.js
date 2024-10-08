const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
require('dotenv').config();
const connectDB = require('./server/config/db')
const mongoStore = require('connect-mongo');
const TodoTask = require("./models/TodoTask");


const port = process.env.PORT || 3000;

const session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
  mongoUrl: process.env.MONGODB_URI
  }),
  // cookie: { maxAge: new Date ( Date.now() + (3600000))}
  }))


  app.use("/static", express.static("public"))
app.use(express.urlencoded({ extended: true }));
connectDB();

app.listen(port, () => console.log(`App listening on port ${port}`));





app.set("view engine", "ejs");



// GET METHOD
app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({});
    res.render("todo.ejs", { todoTasks: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// POST METHOD
app.post('/',async (req, res) => {
  const todoTask = new TodoTask({
  content: req.body.content
  });
  try {
  await todoTask.save();
  res.redirect("/");
  } catch (err) {
  res.redirect("/");
  }
  });

  //UPDATE
  app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find().then(tasks => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    }).catch(err => {
      console.error(err);
      res.status(500).send('Error fetching tasks');
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content })
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error updating task');
      });
  });

  //DELETE
  app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id)
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });