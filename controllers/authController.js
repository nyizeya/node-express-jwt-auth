const User = require("../models/User");
const bcrypt = require('bcrypt')
const { registerValidation } = require("../validation");

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: ''}

    // duplicate error code 
    if (err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
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
        res.status(201).json(savedUser)
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