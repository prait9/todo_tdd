const express = require('express');
const todoController = require('../controllers/todo.controller');

const router = express.Router();

router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.post('/', todoController.createTodo);

module.exports = router;
