const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {  saveUser, deleteAllUsers, getUserByName, getUserByEmail, getAllUser, getUserById } = require('../controllers/user')
var router = express.Router()




//get all uses

router.get("/", async(req, res) => {
    let users = await  getAllUser()
    res.status(200).json({ data: users })
})

//get user by email

// router.get("/:id", async(req, res) => {       
//     let user = await getUserById(req.params.id )
//     res.status(200).json({ data: user })
// })

router.post('/signup', async (req, res) => {
    var user = req.body
    try {
        var newUser = await saveUser(user)
        res.status(201).json({ data: newUser })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})


router.post('/login', async function (req, res) {  

    var { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'please provide email and password' })
    }

    try {

        var user = await getUserByEmail( email )
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        var isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

     var token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET)


      res.status(200).json({ token, status: "success" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})


//lab
router.get("/search", async (req, res) => {
    try {
        var userName = req.query.name
        var user = await getUserByName(userName)
        if (user) res.status(200).json({data:user})
        else {
            res.status(404).json({ message: "There is no user with name: " + userName })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete("/", async (_req, res) => {
    try {
        await deleteAllUsers()
        res.status(200).json({ message: "users have been deleted successfully" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


module.exports = router