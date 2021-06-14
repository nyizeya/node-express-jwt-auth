const User = require("../models/User")

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
    const { email, password} = req.body
    
    try {
        const user = await User.create({ email, password})
        res.status(201).json(user)
    } catch(err) {
        res.status(400).json({message: err})
    }
}


// Post Login
module.exports.login_post = (req, res) => {
    const { email, password} = req.body
    console.log(email, password);
    res.send('login')
}