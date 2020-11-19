import mongoose from "mongoose";
//절대 database에 video 저장 x

const VideoSchema = new mongoose.Schema({
    fileUrl:{
        type: String,
        required : 'File URL is required'
    },
    title:{
        type: String,
        required:"Title is required"
    },
    description: String,
    views:{
        type:Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
});

const model = mongoose.model("Video", VideoSchema);
export default model;
