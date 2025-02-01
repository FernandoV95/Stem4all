import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IUsuario } from "./Users";
import { IVideos } from "./Video";

//Para tipar con interface
export interface IRegistro extends Document {
    usuario: PopulatedDoc<IUsuario & Document>,
    videos: PopulatedDoc<IVideos & Document>[],
}


//Para MongoDB
const RegistroSchema: Schema = new Schema({
    usuario: {
        type: Types.ObjectId,
        ref: 'usuario'
    },
    videos: [{
        type: Types.ObjectId,
        ref: 'videos'
    }]
}, { timestamps: true }
);
const Registro = mongoose.model<IRegistro>('registro', RegistroSchema)
export default Registro

