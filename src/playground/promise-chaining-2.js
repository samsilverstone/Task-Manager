require('../db/mongoose')

const Task=require('../models/tasks')

// Task.findByIdAndDelete("5d3a80670241a21ee806cfc2")
// .then(res=>{
//     console.log(res)
//     return Task.find({completed:false})
// })
// .then(res=>console.log(res))
// .catch(e=>console.log(e))

const deleteTaskCount=async(id,completed)=>{
    // await Task.findByIdAndDelete(id)
    const tasks=Task.find({completed})
    return tasks
}

deleteTaskCount("5d3a80981eb1861f503c83ce",false).then(res=>console.log(res)).catch(err=>console.log(err))