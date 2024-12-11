import { Response, Request, NextFunction } from "express-serve-static-core";
import fileUpload from "express-fileupload";
import path from 'path';
import fs from 'fs';

const uploadPath = path.join(__dirname, '../../../', 'Videos');

// Middleware para manejar la subida de videos
const uploadVideos = (req: Request, res: Response, next: NextFunction) => {
    fileUpload({
        useTempFiles: true,
        tempFileDir: uploadPath,
        createParentPath: true,
    })(req, res, (err:any) => {
        if (err || !req.files?.video) return next('¡Video No almacenado!');
        const video = req.files.video as fileUpload.UploadedFile;
        const uploadFilePath = path.join(uploadPath, video.name);
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        video.mv(uploadFilePath, next);
    });
};


export default uploadVideos
