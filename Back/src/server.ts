import express from "express" 
import VideosRt from "./router/VideosRt"  
import dotenv from "dotenv"
import { conecctDB } from "./config/db"
import path from "path";
import UsuariosRt from "./router/UsuariosRt";
import AutRt from "./router/AutRt";
import AdministracionRt from "./router/AdministracionRt";

dotenv.config()
conecctDB();
const server = express()

//Leer en conosla...Recuerda Borrarlo en testing
server.use(express.json())

//Ruta de los videos
const videosPath = path.join(__dirname, 'React\Stem4all\Videos'); // Ruta absoluta a tu carpeta de videos
server.use('/videos', express.static(videosPath));
server.use('/api/videos',VideosRt)

//Ruta de los usuarios
server.use('/api/usuario',UsuariosRt)

//Ruta de la autorizacion
server.use('/api/aut',AutRt)

//Ruta de la administracion
server.use('/api/administracion',AdministracionRt)

export default server
