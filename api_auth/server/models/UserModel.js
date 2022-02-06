const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        min:3,
        max:30,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        max:50,
        lowercase:true,
        required:true,
    },
    password:{
        type:String,
        min:6,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },

}
,{timestamps:true,}
);

module.exports = mongoose.model("user",userSchema);