var todosModel = require("../models/todo");

function getAllTodos() {
  return todosModel.find().populate("userId", "name");
}

function saveTodo(todo) {
  return todosModel.create(todo);
}

////////////////////////////////////////////////////////////////////////////////////

// Get to do by id
function getTodoById(id) {
  return todosModel.findOne({ _id: id });
}
// update to do using id
function updateTitleTodoById(id, title) {
  return todosModel.findByIdAndUpdate(
    { _id: id },
    { title: title },
    { new: true }
  );
}
//  get all todos with spesific user
function getUserTodos(id) {
  return todosModel.find({ userId: id });
}

// delete all todos
function deleteAllTodos() {
  return todosModel.deleteMany();
}

module.exports = {
  getAllTodos,
  saveTodo,
  getTodoById,
  updateTitleTodoById,
  deleteAllTodos,
  getUserTodos,
};
