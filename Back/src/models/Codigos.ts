import mongoose,{Schema,Document, Types} from "mongoose";

export interface ICodigo extends Document{
    codigo:string
    usuario:Types.ObjectId
    createdAt:Date
}

const CodigoEsquema:Schema=new Schema({
    codigo: {
        type:String,
        required:true
    },
    usuario: {
        type:Types.ObjectId,
        ref:'usuario'
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires:"10m"
    }

}, { timestamps: true } )

const Codigos = mongoose.model<ICodigo>('codigos',CodigoEsquema)
export default Codigos