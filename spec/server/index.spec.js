const supertest=require("supertest")
const app = require("../..")
const { connectToDatabase } = require("../../db.connection")

const request =supertest(app)

describe("server ",()=>{
    beforeAll(async()=>{
        await connectToDatabase()
    })
    it("req get (/) expect to get all todos",async()=>{
      let res= await request.get("/")
      expect(res.body.todos.length).toBe(0)
    })
    it("req get(/xx) expect to get in res body message 'NOT FOUND'",async()=>{
       let res= await request.get("/xxx")
       expect(res.status).toBe(404)
       expect(res.body.message).toBe('NOT FOUND')
    })
})