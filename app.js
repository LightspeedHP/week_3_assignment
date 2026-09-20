require("dotenv").config()
const express = require('express');
const logger = require('./middlewares/logger');
const validatePost = require('./middlewares/validate_post');
const validatePatch = require('./middlewares/validate_patch');
const errorHandler = require('./middlewares/error_handler');
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(logger);

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: "Start backend course", completed: true}
];

// GET All – Read
app.get('/todos', (req, res, next) => {
  try {
    res.status(200).json(todos); // Send array as JSON
  } catch (error) {
    next(error)
  }
});

//GET Single- Read
app.get('/todos/active', (req, res, next) => {
  try {
    const activeTodos = todos.filter((t) => t.completed);
    res.status(200).json(activeTodos);
  } catch (error) {
    next(error)
  } 
});

//GET Active tasks
app.get('/todos/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    const todo = todos.find((t) => t.id === parseInt(id));
    if(!todo)
      return res.status(404).json({message: "Todo not found"})
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// POST New – Create, with task validation
app.post('/todos', validatePost, (req, res, next) => {
  try {
    const {task, completed} = req.body;
    if (!task)
      return res.status(400).json({message: "Missing fields"});
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); // Echo back
  } catch (error) {
    next(error)
  }
});

// PATCH Update – Partial
app.patch('/todos/:id', validatePatch, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (error) {
    next(error)
  }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); // Merge: e.g., {completed: true}
    res.status(200).json(todo);
  } catch (error) {
   next(error) 
  }
});

app.get('/todos/completed', (req, res, next) => {
  try {
    const completed = todos.filter((t) => !t.completed);
    res.json(completed); // Custom Read!
  } catch (error) {
    next(error)
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));