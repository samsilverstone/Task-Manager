const mongoose=require('mongoose')
const validator=require('validator')

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        require:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
const task=mongoose.model('task',taskSchema)

module.exports=task