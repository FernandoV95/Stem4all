import mongoose, { Schema, Document } from "mongoose";

const rol = {
    USER: 'usuario',
    ADMIND: 'administrador',
} as const

export type Rol = typeof rol[keyof typeof rol]

export interface IUsuario extends Document {
    nombres: string
    apPat: string
    apMat: string
    tel: number
    email: string
    contraseña: string
    rol:string

    matricula: string
    instAdscrp?: string
    alcaldia: string
    genero: string
    añosDocencia?: number
    carrera: string
    numEmpleado:string
    materias?:string[]

    verificado: boolean
    autorizado: boolean
    suspendido: boolean
}

const UsuarioEsquema: Schema = new Schema({
    nombres: {
        type: String,
        required: true,
    },
    apPat: {
        type: String,
        required: true
    },
    apMat: {
        type: String,
        required: true
    },
    tel: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },

    rol: {
        type: String,
        enum: Object.values(rol),
        default: rol.USER
    },

    matricula: {
        type: String,
        required:true,
    },
    instAdscrp: {
        type: String,
    },
    alcaldia: {
        type: String,
        required:true
    },
    genero: {
        type: String,
        required:true
    },
    añosDocencia:{
        type:Number
    },
    carrera: {
        type: String,
    },
    numEmpleado:{
        type:String
    },
    materias:[{
        type: String,
    }],
    verificado: {
        type: Boolean,
        default: false
    },
    autorizado: {
        type: Boolean,
        default: false
    },
    suspendido:{
        type: Boolean,
        default: false
    }
}, { timestamps: true }
)

const Usuario = mongoose.model<IUsuario>('usuario', UsuarioEsquema)
export default Usuario