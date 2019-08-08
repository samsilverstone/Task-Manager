require('../db/mongoose')

const User=require('../models/users')

// User.findByIdAndUpdate("5d39b1a01e45f169f4430214",{age:0}).then(res=>{
//     console.log(res)
//     return User.countDocuments({age:0}).then(res=>console.log(res))
// })

const find=async()=>{
    await User.findByIdAndUpdate("5d39b1a01e45f169f4430214",{age:24})
    const result=await User.countDocuments({age:0})
    return result
}

find().then(res=>console.log(res)).catch(err=>console.log(err))