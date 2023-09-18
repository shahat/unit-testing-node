// const validator=require('validator')

// console.log( validator.isEmail("mona@gmail.com"));

//////////////////////////////////////////////////////////////////////////////

const express = require("express");
// const mongoose=require('mongoose');
const cors = require("cors");
var todoRoutes = require("./routes/todo");
var userRoutes = require("./routes/user");
var todosModel = require("./models/todo");
const { connectToDatabase } = require("./db.connection");
console.log(process.env.x);

var app = express();
//middleware
// app.set('view engine', 'pug');
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

//handling routes
app.use("/user", userRoutes);
app.use("/todo", todoRoutes);

app.get("/", async function (req, res) {
  var todos = await todosModel.find();
  res.status(200).json({ todos });
});

//not found
app.use("*", function (req, res, next) {
  res.status(404).json({ message: "NOT FOUND" });
});

//error handling
// app.use(function(err,req,res,next){

//     res.status(500).json({message:'Something went wrong !'})

// })

//custom middleware
app.use(function (req, res, next) {
  console.log(req.body);
  next();
});

// connectToDatabase().then(()=>{
//     console.log("connected to db successfully")
// }).catch((err)=>{
//     console.log(err);
// })

var port = 3333;
app.listen(port, () => {
  console.log(`server listening successfully on port ${port}`);
});

module.exports = app;

//cors

//www.example.com             ex.www.example.com
