import { Router } from "express";
import { VideosCtl } from "../controllers/VideosCtl"; 
import { InputErrors } from "../middleware/InputError"; 
import uploadVideos from "../middleware/uploadVideos";


const VideosRt = Router()

//Subir videos
VideosRt.post('/subir',
    InputErrors,
    uploadVideos,
    VideosCtl.subirVideo
)

//ver todos los videos
VideosRt.get('/ver',
    InputErrors,
    VideosCtl.verTodosVideos
)

//Ver videos por Id
VideosRt.get('/ver/:id',
    InputErrors,
    VideosCtl.verVideosId
)


//Actualizar datos del video
VideosRt.put('/actualizar/:id',
    InputErrors,
    VideosCtl.actualizarVideo
)

//Borrar video
VideosRt.delete('/borrar/:id',
    InputErrors,
    VideosCtl.borrarVideo
)



export default VideosRt