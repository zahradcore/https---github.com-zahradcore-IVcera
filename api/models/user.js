const { use } = require('express/lib/application')
const mongoose = require ('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value){
          if(!validator.isEmail(value)){
           throw new Error('Emailova adresa neni platna') 
          }
        }
      },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
      
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    updatedAt:{
        type: Date,
        default: () => Date.now(),
    },
})

userSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'author'
})

userSchema.statics.findByCredentials = async (username, password) =>{
  console.log(`Hledam uzivatelske jmeno ${username}, zadane heslo je ${password}`)
  const user = await User.findOne({username})
  if(!user){
    const error = 'Prihlaseni selhalo - prihlasovaci udaje nejsou sprarvne'
    console.log(error)
    return null
  }
 
  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
    const error = 'prihlaseni selhalo - spatne heslo'
    console.log(error)
    return null
  }
  return user

}

userSchema.pre('save', async function(next){
    const user = this
    
    user.password =await bcrypt.hash(user.password,10)
    


    next()
  

})

const User = mongoose.model('User',userSchema)

module.exports = User