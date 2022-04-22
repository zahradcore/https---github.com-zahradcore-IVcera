const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const hbs = require('hbs')
const session = require('express-session')
const methodOverride = require('method-override')

const path = require('path')
const userRouter = require('./api/routes/user')
const articleRouter = require('./api/routes/article')

const publicDirectoryPath = path.join(__dirname,'./public/')


const partialsPath = path.join(__dirname,'./templates/partials')
const viewsPath = path.join(__dirname, './templates/views')
hbs.registerPartials(partialsPath)

mongoose.connect('mongodb://localhost:27017/clanky',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conected to database'))

const app = express() 
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))

sessionConfiguration = {
    secret: 'topsecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxage: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfiguration))

app.use(express.static(publicDirectoryPath))


app.use(userRouter)
app.use(articleRouter)

app.set('view engine', 'hbs')
app.set('views', viewsPath)




app.listen(port, () => {
    console.log(`Server posloucha na portu ${port}`)
})
