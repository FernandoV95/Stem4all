import express from "express" 
import VideosRt from "./router/VideosRt"  
import dotenv from "dotenv"
import { conecctDB } from "./config/db"
import path from "path";

dotenv.config()
conecctDB();
const server = express()

//Leer en conosla...Recuerda Borrarlo en testing
server.use(express.json())

const videosPath = path.join(__dirname, 'React\Stem4all\Videos'); // Ruta absoluta a tu carpeta de videos
server.use('/videos', express.static(videosPath));

server.use('/api/videos',VideosRt)

export default server
