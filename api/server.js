const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const dotenv = require('dotenv')
// const mongoose=require("mongoose")
app.use(express.json())
app.use(cors())
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

const Todo = require('./models/Todo');
app.get('/todo', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
})

app.post('/todo/new', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
})

app.get('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
})

app.listen('5000', () => {
    console.log("Backend is running")
})