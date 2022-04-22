const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    
    },
    text: {
        type: String,
        required: true,
        
    },
    completed:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt:{
        type: Date,
        default: () => Date.now(),
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

articleSchema.virtual('url').get(function(){
    return '/articles/' + this._id
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article