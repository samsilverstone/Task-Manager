const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'anonymous',
        uppercase: true,
        trim: true,
        require: [true, 'User name is required']
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Value cannot be less than 0")
            }

        }
    },

    email: {
        type: String,
        require: [true, 'email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("The Email entered is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(pass) {
            if (pass.length < 6) {
                throw new Error("Cannot create a password whose length is less than 6")
            } else if (pass.includes('password')) {
                throw new Error("Cannot create a password which includes the term password in it.")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    console.log("running altered data")
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    console.log(userObject)
    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user.id.toString()
    }, 'NewToken')
    user.tokens = user.tokens.concat({
        token
    })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })
    if (!user) {
        throw new Error('User does not exist')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Password Incorrect")
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User