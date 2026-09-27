require("dotenv").config()
const express = require('express');
const logger = require('./middlewares/logger');
const validatePost = require('./middlewares/validate_post');
const validatePatch = require('./middlewares/validate_patch');
const errorHandler = require('./middlewares/error_handler');
const connectDB = require("./database/db");
const Todo = require("./models/todo_model");
const app = express();
app.use(express.json()); // Parse JSON bodies
connectDB();
app.use(logger);


// GET All – Read
app.get('/todos', async(req, res, next) => {
  try {
    let query = {};
    if(req.query)
      query = req.query.completed
    const todos = await Todo.find({query});
    res.status(200).json(todos); // Send array as JSON
  } catch (error) {
    next(error)
  }
});

//GET Active tasks
app.get('/todos/active', async(req, res, next) => {
  try {
    const activeTodos = await Todo.find({completed: false});
    res.status(200).json(activeTodos);
  } catch (error) {
    next(error)
  } 
});

//GET Inactive tasks
app.get('/todos/completed', async(req, res, next) => {
  try {
    const completed = await Todo.find({completed: true});
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error)
  }
});

//GET Single- Read
app.get('/todos/:id', async(req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if(!todo)
      return res.status(404).json({message: "Todo not found"})
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// POST New – Create, with task validation
app.post('/todos', validatePost, async(req, res, next) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error)
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo)
      return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (error) {
   next(error) 
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));