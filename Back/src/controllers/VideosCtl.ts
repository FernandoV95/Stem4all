import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import Video from '../models/Video';
import {cambiarRuta } from '../util/datosVideo';

export class VideosCtl {

    //Subir videos
    static subirVideo = async (req: Request, res: Response): Promise<void> => {
        try {
            const datos = req.files?.video as UploadedFile;

            const nuevoVideo = new Video(req.body)
            nuevoVideo.mimetype = datos.mimetype
            nuevoVideo.url = cambiarRuta(datos.name, datos.tempFilePath)

            //salvar datos
            await nuevoVideo.save()

            res.status(400).send('Video almacenado')

        } catch (error: any) {
            console.error('Error al subir el video:', error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
            return
        }
    }

    //Ver todos los videos
    static verTodosVideos = async (req: Request, res: Response): Promise<void> => {
        try {

            const videos = await Video.find({})
            if (!videos) {
                res.status(500).send('¡No Hay videos!');
                return
            }
            res.status(400).json(videos)
        } catch (error: any) {
            console.error('Error al acceder a los video:', error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
            return
        }
    }

    //Ver videos  por id
    static verVideosId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params
            res.status(200).send(`Vamos a ver el video ${id}`);
        } catch (error: any) {
            console.error('Error al acceder al video:', error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
            return
        }
    }
 

    //Actualizar datos del video
    static borrarVideo = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params
            res.status(200).send(`Vamos a borrar el video ${id}`);
        } catch (error: any) {
            console.error('Error al borrar el video:', error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
            return
        }
    }


    //Borrar videos
}
