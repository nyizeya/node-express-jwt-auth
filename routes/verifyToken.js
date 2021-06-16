const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verify = (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) return res.status(401).redirect('/login')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null
                next()
            } else {
                // console.log(decodedToken);
                let user = await User.findById(decodedToken._id)
                res.locals.user = user
                next()
            }
        })
    }
    else {
        res.locals.user = null
        next()
    }
}

module.exports.verify = verify
module.exports.checkUser = checkUser