const supertest = require("supertest");
const app = require("../..");
const { connectToDatabase, clearDatabase } = require("../../db.connection");

const request = supertest(app);

describe("todo routes ", () => {
  let mockUser, token, userInDB, todoInDB;
  beforeAll(async () => {
    await connectToDatabase();
    mockUser = { name: "ahmed", email: "asd@xxx.com", password: "1234" };
    let res = await request.post("/user/signup").send(mockUser);
    userInDB = res.body.data;
    let res2 = await request
      .post("/user/login")
      .send({ email: userInDB.email, password: mockUser.password });
    token = res2.body.token;
  });
  it("req get (/todo/) expect to get all todos", async () => {
    let res = await request.get("/todo");
    expect(res.body.data.length).toBe(0);
  });
  it("req post (/todo/) expect to not to add with no auth", async () => {
    let res = await request.post("/todo").send({ title: "eat lunch" });
    expect(res.status).toBe(401);
    expect(res.body.message).toContain("please login first");
  });
  it("req post (/todo/) expect to not to add with correct auth", async () => {
    let res = await request
      .post("/todo")
      .send({ title: "eat lunch" })
      .set({ authorization: token });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("eat lunch");
    todoInDB = res.body.data;
  });
  it("req get (/todo/) expect to get the just added todo", async () => {
    let res = await request.get("/todo");
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].userId._id).toBe(userInDB._id);
  });
  it("req get (/todo/id) expect to get the just added todo with id", async () => {
    let res = await request
      .get("/todo/" + todoInDB._id)
      .set({ authorization: token });
    expect(res.body.data._id).toBe(todoInDB._id);
  });
  afterAll(async () => {
    await clearDatabase();
  });
});
