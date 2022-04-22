const express = require('express')
const Article = require('../models/article')
const router = new express.Router()

const session = require('express-session')
const authenticate = require('../../src/middleware/authenticate')
const User = require('../models/user')



// formular pro registraci
router.get('/register', (req,res) =>{
    res.render('register',{
        title: 'iVcera'
    })
})

//vytvoreni uzivatele
router.post('/register', async(req, res) =>{
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        //res.status(201).json(newUser)
        res.redirect('/users')

    } catch (error) {
        //res.status(400).json({message: error.message})
        res.redirect('/register')
    }
})

// formulář pro přihlášení
router.get('/users', (req, res) => {
    res.render('login.hbs', {
        title: 'iVcera'
    })
})

//prihlaseni uzivatele
router.post('/users',async(req, res)=>{
    const {username,password} = req.body
    try {
        const foundUser = await User.findByCredentials(username,password)
        if(!foundUser){
            //res.status(400)
            return res.redirect('/users')
        }
        console.log(foundUser._id)
        req.session.user_id = foundUser._id
        res.status(200)
       res.redirect('/articles')
    } catch (error) {
        res.status(400).redirect('/users')
       // res.redirect('/users')
    }
    
})

// vypis prihlaseni uzivatele
router.get('/users/me', async(req, res) => {
    const user_id = req.session.user_id
    console.log(user_id)
    const foundUser = await User.findById(user_id)
    console.log(foundUser)
    if(!foundUser){
        res.status(400)
        res.redirect('/users')
    }
    res.render('user.hbs', {
        title: 'iVcera',
        user: foundUser
    })
})

//odhlas prihlaseneho uzivatele
router.get('/logout', authenticate, (req, res)=>{
    req.session.user_id = null
    res.redirect('/users')
})

//formular pro aktualizaci uzivatele - get
router.get('/users/me/update', authenticate, async(req, res)=>{
    const search_data = { _id: req.session.user_id}
    try {
        const user = await User.findOne(search_data, 'name email')
        if(!user){
            res.status(404)
            return res.redirect('/login')
        }
        res.render('user-update.hbs',{
            title: 'iVcera',
            user: user
        })
    } catch (error) {
        res.status(500)
        res.redirect('login')
    }
})

//aktualizuj uzivatele - patch
router.patch('/users/me/update', authenticate, async(req, res)=>{
    const search_data = { _id: req.session.user_id}
    const update_options = { useFindAndModify: false, new : true, runValidators : true}
    try {
        const user = await User.findOneAndUpdate(search_data, req.body,update_options)
        if(!user){
            res.status(404)
            return res.redirect('/users')
        }
        res.status(200)
        res.redirect('/articles');
    } catch (error) {
        res.status(200)
        res.redirect('/users')
    }
})

//formular pro smazani uzivatele
router.get('/users/me/delete', authenticate, async(req, res)=>{
    const user_id = req.session.user_id
    try {
        const user = await User.findOne({_id: user_id}, 'username')
        if(!user){
            res.status(404)
            return res.redirect('/users')
        }
        const articles = await Article.find({author: user_id})
        res.render('user-delete.hbs',{
            title: 'iVcera',
            user: user,
            articles: articles
        })
    } catch (error) {
        res.status(500)
        res.redirect('/users')
    }
})

//smaz uzivatele - delete
router.delete('/users/me/delete', authenticate, async(req, res)=>{
    const user_id = req.session.user_id
    try {
        const user = await User.findByIdAndDelete(user_id)
        if(!user){
            return res.status(404).redirect('/users')
        }
        const deletedCount = await Article.deleteMany({author: user._id})
        res.session.user_id = null
        res.redirect('/users')
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router


