const express = require("express");
var router = express.Router();
var {
  getAllTodos,
  saveTodo,
  getTodoById,
  updateTitleTodoById,
  getUserTodos,
  deleteAllTodos,
} = require("../controllers/todo");
var auth = require("../middlewares/auth");

// router.use(auth)

//get all todos
router.get("/", async (_req, res) => {
  try {
    var todos = await getAllTodos();
    res.status(200).json({ data: todos });
  } catch (err) {
    res.status(500).json({ message: "Couldn't find todos try again" });
  }
});

//delete all todos
router.delete("/", async (req, res) => {
  try {
    await deleteAllTodos();
    res.status(200).json("all messages deleted");
  } catch (err) {
    res.status(500).json({ message: "Couldn't delete all todos try again" });
  }
});
//save todo
router.post("/", auth, async (req, res) => {
  var title = req.body.title;
  try {
    var newTodo = await saveTodo({ title: title, userId: req.id });
    res.status(201).json({ data: newTodo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get todo by id
router.get("/:id", auth, async (req, res) => {
  var { id } = req.params;

  try {
    var todo = await getTodoById(id);
    if (todo) {
      res.status(200).json({ data: todo });
    } else {
      res.status(404).json({ message: "todo not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//lab
//update todo by id
router.patch("/:id", auth, async (req, res) => {
  var { title } = req.body;
  var { id } = req.params;

  try {
    if (id && title) {
      var UpdatedTodo = await updateTitleTodoById(id, title);
      res.status(200).json({ data: UpdatedTodo });
    } else
      res
        .status(400)
        .json({ message: "must provide title and id to edit todo" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all todos for user=> id
router.get("/user/:id", auth, async (req, res) => {
  var { id } = req.params;

  try {
    if (id) {
      var todos = await getUserTodos(id);
      todos.length > 0 && res.status(200).json({ data: todos });
      todos.length == 0 &&
        res.status(404).json({ message: "Couldn't find any todos for " + id });
    } else
      res
        .status(400)
        .json({ message: "must provide user id to get his todos" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
