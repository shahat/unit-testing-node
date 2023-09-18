const supertest = require("supertest")
const app = require("../..")
const { connectToDatabase, clearDatabase } = require("../../db.connection")

const request = supertest(app)


describe("lab testing:", () => {
    let mockUser,token,userInDB,todoInDB
    beforeAll(async () => {
        await connectToDatabase()
        mockUser = { name: "ahmed", email: "asd@xxx.com", password: "1234" }
        let res= await request.post("/user/signup").send(mockUser)
        userInDB= res.body.data
        let res2= await request.post("/user/login").send({email:userInDB.email,password:mockUser.password})
        token = res2.body.token
        let todo= await request.post("/todo").send({title:"do homework",userId:userInDB._id}).set({authorization:token})
        todoInDB= todo.body.data
        console.log(todoInDB);
     })
    describe("users routes:", () => {
        // Note: user name must be sent in req query not req params
        it("req to get(/search) expect to get the correct user with his name", async () => {
            //imp i have commented the basic get method in the routes
            let res= await request.get("/user/search/?name="+userInDB.name)
            expect(res.status).toBe(200)
            expect(res.body.data.name).toBe(userInDB.name) 
        })
        it("req to get(/search) with invalid name expect res status and res message to be as expected", async () => {
            let res= await request.get("/user/search/?name=ds")
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("There is no user with name: ds" ) 
        })

        it("req to delete(/) expect res status to be 200 and a message sent in res", async () => {
            let res = await request.delete("/user")
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("users have been deleted successfully" ) 
        })
    })

    
    describe("todos routes:", () => {
        fit("req to patch(/) and send id only expect res status and res message to be as expected", async () => {
            let res = await request.patch("/todo/" + todoInDB._id).set({authorization:token})
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("must provide title and id to edit todo")
            
        })
        fit("req to patch(/) and send id , title expect res status and res to be as expected", async () => {
            let res = await request.patch("/todo/" + todoInDB._id).send({title:"don't do anything"}).set({authorization:token})
            expect(res.status).toBe(200)
            expect(res.body.data.title).toBe("don't do anything")
        })

        fit("req to get( /user/:id) expect get user's todos", async () => {
            let res = await request.get("/todo/user/" + userInDB._id).set({authorization:token})
            expect(res.status).toBe(200)
            // add another expectation here
        })
    })
    afterAll(async () => {
        await clearDatabase()
    })
})