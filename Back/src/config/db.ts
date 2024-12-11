import mongoose from "mongoose";
import colors from "colors";
import {exit} from "node:process"

export const conecctDB = async()=>{
    try{
        const {connection} = await mongoose.connect(process.env.DB_URL);
        const url = `${connection.host}:${connection.port}`
        console.log(colors.blue.bold(`MongoDB conectado en: ${url}`));
    }catch(error){
        console.log(colors.bgRed.bold('Error al conectar a MongoDB'))
        exit(1)
    }
}
