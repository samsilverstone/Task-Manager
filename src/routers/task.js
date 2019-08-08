const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/tasks')

router.post('/tasks', auth, async (req, res) => {
    try {
        task = new Task({
            ...req.body,
            owner: req.user._id
        })
        const tasks = await task.save()
        res.status(201).send(tasks)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/tasks', auth, async (req, res) => {
    try {
        match = {}
        sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // const tasks = await Task.find({
        //     owner: req.user._id,
        //     ...match
        // })
        res.status(200).send(req.user.tasks)
        // res.send(tasks)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task=await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        // await req.user.populate('tasks').execPopulate()
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updateOptions = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => updateOptions.includes(update))

    if (!isValid) {
        return res.status(400).send({
            "error": "Option does not exist!"
        })
    }

    try {
        const task = await Task.findById({
            _id: req.params.id,
            owner: req.user._id
        })
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router