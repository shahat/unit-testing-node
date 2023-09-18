const {
  getAllTodos,
  saveTodo,
  getTodoById,
  updateTitleTodoById,
  getUserTodos,
  deleteAllTodos,
} = require("../../controllers/todo");
const { saveUser } = require("../../controllers/user");
const { connectToDatabase, clearDatabase } = require("../../db.connection");

describe("db todo:", () => {
  let mockUser, MockTodo;
  beforeAll(async () => {
    await connectToDatabase();
    mockUser = { name: "noha", email: "xx@xx.com", password: "1234" };
    let user = await saveUser(mockUser);
    MockTodo = { title: "study HTML", userId: user._id, status: "Todo" };
  });

  it("get all todo in the beginning", async () => {
    let todos = await getAllTodos();
    expect(todos.length).toBe(0);
  });
  
  it("add new todo", async () => {
    let newTodo = await saveTodo(MockTodo);
    expect(newTodo.title).toBe(MockTodo.title);
    expect(newTodo).toEqual(jasmine.objectContaining(MockTodo));
  });
  it("get all todos after adding", async () => {
    let todos = await getAllTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toEqual(jasmine.any(String));
  });
  afterAll(async () => {
    await clearDatabase();
  });

  //for lab
  describe("getTodoById:", () => {
    it("expect to get the just added todo correctly by id", async () => {
      let newTodo = await saveTodo(MockTodo);
      let todo = await getTodoById(newTodo._id);
      expect(todo._id).toEqual(newTodo._id);
    });
  });

  describe("updateTitleTodoById:", () => {
    it("expect to edit title of the just added todo", async () => {
      let newTodo = await saveTodo(MockTodo);
      let todo = await updateTitleTodoById("study Java-script", newTodo._id);
      expect(todo.title).toBe("study Java-script");
    });
  });

  describe("getUserTodos:", () => {
    // add new user then add some new todos for him then test the function
    it("expect to get all todos for specific user", async () => {
      let newTodo = await saveTodo(MockTodo);
      let todos = await getUserTodos(newTodo.userId);
      expect(todos[0].title).toContain("study HTML");
    });
  });

  describe("deleteAllTodos:", () => {
    fit("expect to delete all todos", async () => {
      let newTodo = await saveTodo(MockTodo);
      let todos = await deleteAllTodos();
      // see if the acknowledged is tru or not 
      expect(todos.acknowledged).toBeTrue();
    });
  });
});
