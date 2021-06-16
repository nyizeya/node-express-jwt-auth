const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { registerValidation } = require("../validation");

const maxAge = 60 * 60 * 24 * 3

// create json token
const createToken = (id) => {
    return jwt.sign({_id: id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
}

// Get SignUp
module.exports.signup_get = (req, res) => {
    res.render('signup')
}

// Get Login
module.exports.login_get = (req, res) => {
    res.render('login')
}

// Post SignUp
module.exports.signup_post = async (req, res) => {
    // validating user input data before trusting them
    const { error } = registerValidation(req.body)

    // check if there's an error
    if (error) return res.status(400).json(error.details[0].message)

    // check if email already existed in the db
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send("Email Already Exist")

    // hash the use password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        const token = createToken(user._id)
        res.cookie('jwt', token, {
            maxAge: maxAge * 1000,
            httpOnly: true
        })
        res.status(201).json({user: savedUser._id})
    } catch (err) {
        res.status(400).json(err)
    }
    // res.json(data)
}


// Post Login
module.exports.login_post = (req, res) => {
    const { email, password} = req.body
    console.log(email, password);
    res.send('login')
}