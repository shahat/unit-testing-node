const supertest = require("supertest");
const app = require("../..");
const { connectToDatabase, clearDatabase } = require("../../db.connection");

const request = supertest(app);

describe("user routes ", () => {
  let mockUser, userInDB;
  beforeAll(async () => {
    await connectToDatabase();
    mockUser = { name: "ahmed", email: "asd@xxx.com", password: "1234" };
  });
  it("req get (/user/) expect to get all users", async () => {
    let res = await request.get("/user/");
    expect(res.body.data.length).toBe(0);
  });
  it("req post(/user/signup) expect to add new user", async () => {
    let res = await request.post("/user/signup").send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe(mockUser.email);
    userInDB = res.body.data;
  });
  it("req post(/user/signup) expect to add new user with wrong body", async () => {
    let res = await request
      .post("/user/signup")
      .send({ name: "ali", password: "1234" });
    // console.log('res: ', res.body);
    expect(res.body.message).toContain("`email` is required");
  });
  it("req get (/user/id) expect to get user with id", async () => {
    let res = await request.get("/user/" + userInDB._id);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(userInDB.email);
  });
  it("req post (/user/login) expect to login with correct user", async () => {
    let res = await request
      .post("/user/login")
      .send({ email: userInDB.email, password: "1234" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it("req post (/user/login) expect to login with wrong user password", async () => {
    let res = await request
      .post("/user/login")
      .send({ email: userInDB.email, password: "xxxxx" });
    expect(res.body.message).toContain("Invalid email or password");
  });
  afterAll(async () => {
    await clearDatabase();
  });
});
