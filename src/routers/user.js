const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const multer = require('multer')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const {
    signupMail,
    deactivateMail
} = require('../email/account')

router.post('/users', async (req, res) => {
    try {
        user = new User(req.body)
        await user.save()
        signupMail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try{
    //     const users=await User.find({})
    //     res.status(200).send(users)
    // }catch(e){
    //     res.status(404).send(e)
    // }   
})



router.patch('/users/me', auth, async (req, res) => {
    const updateOptions = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => updateOptions.includes(update))

    if (!isValid) {
        return res.status(400).send({
            "error": "The option does not exists"
        })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
        deactivateMail(req.user.email, req.user.name)
    } catch (e) {
        res.status(500).send()
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('jpg') || file.originalname.endsWith('jpeg') || file.originalname.endsWith('png')) {
            cb(new Error('Can only upload jpg,jpeg and png file'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }

})

module.exports = router