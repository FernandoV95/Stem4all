import mongoose,{Schema,Document} from "mongoose";

//Para tipar con interface
export interface IVideos extends Document {
    titulo:string
    materia:string
    descripcion:string
    mimetype:string
    url:string
}

//Para MongoDB
const VideoSchema: Schema = new Schema({
    titulo:{
        type:String,
        required:true
    },
    materia:{
        type:String,
        required:true, 
    },
    descripcion:{
        type:String,
        required:true
    },
    mimetype:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true,
        unique:true
    }
   }, {timestamps: true }
);
const Videos = mongoose.model< IVideos >('videos',VideoSchema)
export default Videos
