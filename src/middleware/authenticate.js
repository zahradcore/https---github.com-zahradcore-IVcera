const User = require('../../api/models/user')

const authenticate = async (req, res, next) =>{
    console.log(`${req.session.user_id} uzivatelske id ve fci authenticate`)
    if(!req.session.user_id){
        return res.status(401).redirect('/users')
    }
    next()
}

module.exports = authenticate