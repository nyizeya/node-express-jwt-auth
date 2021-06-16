const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { registerValidation, loginValidation } = require("../validation");

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
    if (error) return res.status(400).json({error: {
            message: error.details[0].message,
            path: error.details[0].path[0]
        }
    })
    // if (error) return res.status(400).json({error: error.details[0].path[0]})

    // check if email already existed in the db
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).json({error: {
        message: "Email Already Exist"
    }})

    // hash the user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save()
        // const token = createToken(user._id)
        // res.cookie('jwt', token, {
        //     maxAge: maxAge * 1000,
        //     httpOnly: true
        // })
        // res.header('auth-token', token)
        res.status(201).json({user: savedUser._id})
    } catch (err) {
        res.status(400).json({error: {
            message: err
        }})
    }
}


// Post Login
module.exports.login_post = async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).json({error: {
        message: error.details[0].message,
        path: error.details[0].path[0]
    }}) 

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: {
        message: "Email Not Found"
    }})

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).json({ error: {
        message: "Incorrect Password"
    }})

    const token = createToken(user._id)
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.header('auth-token', token).json({user: user._id})
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}