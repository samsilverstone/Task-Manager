const express = require('express')
require('./db/mongoose')
const multer = require('multer')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const upload = multer({
    dest: 'Images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('doc') || file.originalname.endsWith('docx')) {
            cb(new Error('Can only upload doc or docx file'))
        }
        cb(undefined, true)
    }
})

app.post('/uploads', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

app.listen(port, () => {
    console.log("Server is up and running")
})