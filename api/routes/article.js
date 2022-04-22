

const express = require('express')
const Article = require('../models/article')
const router = new express.Router()

const session = require('express-session')
const authenticate = require('../../src/middleware/authenticate')



//Getting all

    router.get('/articles',async (req, res) => {
        const articles = await Article.find()
        if (!articles) {
            res.status(500).send()
        }
        res.render('home.hbs', {
            title: 'iVcera',
            articles: articles
        })
    })

//formular pro vytvoreni clanku
router.get('/articles/create', authenticate, async(req, res)=>{
    res.render('article-create.hbs',{
        title: 'iVcera'
    })
})

//vytvor ulohu
router.post('/articles/create', authenticate, async(req, res)=>{
    const user_id = req.session.user_id
    const article = new Article({
        title: req.body.title,
        text: req.body.text,
        author: user_id
    })
    try {
        await article.save()
        res.status(201)
        res.redirect('/articles')
    } catch (error) {
        res.status(400).send(error)
    }
})

//vypis jeden clanek

router.get('/articles/:id', authenticate, async(req, res)=>{
    const search_data = {_id: req.params.id, author: req.session.user_id}
    const article = await Article.findOne(search_data)
    if(!article){
        res.status(404).send()
    } res.render('article-detail.hbs',{
        title: 'iVcera',
        article: article

    })
})

//vykresli formular pro aktualizaci ulohy
router.get('/articles/:id/update', authenticate, async(req, res)=>{
    const search_data = {_id: req.params.id, author: req.session.user_id}
    try {
        const article = await Article.findOne(search_data)
        if(!article){
            res.status(404)
            return res.redirect('/articles')
        }
        res.render('article-update.hbs',{
            title: 'iVcera',
            article: article
        })
    } catch (error) {
        res.status(500)
        res.redirect('articles')
    }
})

router.patch('/articles/:id/update',authenticate, async(req, res)=>{
    const search_data = {_id: req.params.id, author: req.session.user_id}
    const update_options = { useFindAndModify: false, new : true, runValidators : true }
    try {
        const article = await Article.findOneAndUpdate(search_data, req.body, update_options)
        if(!article){
            return res.status(404).send()
        }
        res.redirect('/articles')
    } catch (error) {
        res.status(400).send(e)
    }
})

//formlular pro smazani ulohy - get
router.get('/articles/:id/delete', authenticate, async(req, res)=>{
    const search_data = {_id: req.params.id, author: req.session.user_id}
    try {
        const article = await Article.findOne(search_data)
        if(!article){
            return res.redirect('/articles')
        }
        res.render('article-delete.hbs',{
            title: 'iVcera',
            article: article

        })
    } catch (error) {
        res.status(500).send()
    }
})

//smaz ulohu - delete
router.delete('/articles/:id/delete', authenticate, async(req, res)=>{
    const search_data = {_id: req.params.id, author: req.session.user_id}
    try {
        const article = await Article.findOneAndDelete(search_data)

        if(!article){
            return res.status(404).send()
        }
        res.redirect('/articles')
    } catch (error) {
        res.status(500).send()
        
    }
})





module.exports = router