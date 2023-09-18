const { connectToDatabase } = require("../../db.connection")


xdescribe("db:",()=>{
    it("connection",()=>{
        expect(async function(){await connectToDatabase() } ).not.toThrow()
    })
})