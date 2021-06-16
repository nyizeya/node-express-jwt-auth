// const jwt = require('jsonwebtoken')
// require("dotenv/config")

// const verify = (req, res, next) => {
//     const token = req.header('auth-token')
//     if (!token) return res.status(400).send('Access Denied')

//     try {
//         const verified = jwt.verify(token, process.env.TOKEN_SECRET)
//         req.user = verified
//         next()
//     } catch (err) {
//         res.redirect('/login')
//     }
// }

// module.exports = verify

const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
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
