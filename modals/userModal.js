const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const userSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Full Name']
    },
    email:{
        type: String,
        required:[true, 'PLease specify your email'],
        unique: true,
        validate: [validator.isEmail, 'PLease provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please specify your Password!'],
        minlength: 8,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,12)
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword)
}


const User = mongoose.model('User', userSchema);

module.exports = User;