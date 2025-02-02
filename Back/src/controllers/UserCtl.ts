import type { Request, Response } from "express";
import Usuario from "../models/Users";
import { hashPassword } from "../util/Hash";
import Codigos from "../models/Codigos";
import { generarCodigo } from "../util/generarCodigo";
import { generarMatricula } from "../util/generarMatricula";
import Videos from "../models/Video";
import Registro from "../models/Historial";

export class UsuarioCtl {

    //controlador para crear un usuario
    static nuevoUsuario = async (req: Request, res: Response) => {
        try {
            const { contraseña, email, apPat, apMat, nombres } = req.body

            // Prevenir duplicados
            const usr = await Usuario.findOne({ email })

            if (usr) {
                res.status(409).send('!Correo Registrada¡')
                return
            }

            //Almacenamos los datos en la base de datos
            const NvoUsuario = new Usuario(req.body)

            // Generar matrícula de manera única
            let esvalida = false;
            while (!esvalida) {
                // Generamos otra matrícula
                NvoUsuario.matricula = generarMatricula(apPat, apMat, nombres);

                // Buscamos si ya existe la matrícula
                const existe = await Usuario.findOne({ matricula: NvoUsuario.matricula });

                esvalida = !existe ? true : false;
            }

            //Hasear la contraseña
            NvoUsuario.contraseña = await hashPassword(contraseña)

            //Genera el codigo de verificacion
            const cdg = new Codigos;
            cdg.codigo = generarCodigo();
            cdg.usuario = NvoUsuario.id;

            //Crear su historial de videos
            const reg = new Registro;
            reg.usuario = NvoUsuario.id;

            // Guardar usuario y codigo 
            const [usrSuccess, codSuccess, regSuccess] = await Promise.all([
                NvoUsuario.save(),
                cdg.save(),
                reg.save()
            ])

            // Verificar si alguna de las promesas falló
            if (!usrSuccess || !codSuccess || !regSuccess) {
                if (usrSuccess) {
                    await NvoUsuario.deleteOne();  // Elimina el usuario
                }
                if (codSuccess) {
                    await cdg.deleteOne();  // Elimina el código
                }
                if (regSuccess) {
                    await reg.deleteOne();  // Elimina el historial
                }
                res.status(500).json({ error: '!No pudimos almacenar los datos¡' });
                return
            }


            //Enviamos el correo ... pendiente

            res.status(201).send('Hemos enviado tu codigo a tu correo')
        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Actualizar datos del usuario-Pendiente
    static actMisDatos = async (req: Request, res: Response) => {
        try {
            const { idU } = req.params

            //Buscamos al usuario
            const usuario = await Usuario.findById(idU)

            if (!usuario) {
                res.status(409).send('¡Usuario no registrado!')
                return
            }

            //Guardamos los cambios 
            const userSucess = await Usuario.findByIdAndUpdate(idU, req.body, { new: true });

            //Verificamos si se hicieron los cambios
            if (!userSucess) {
                const error = new Error('!No pudimos guardar cambios¡');
                res.status(500).json({ error: error.message });
                return;
            }

            res.status(201).send('Datos modificados')

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Agregar videos a la lista
    static agregarVideo = async (req: Request, res: Response) => {
        try {
            const { idU, idV } = req.params;

            //Buscamos al usuario
            const usuario = await Usuario.findById(idU)
            if (!usuario) {
                res.status(409).json({ error: '¡Usuario no registrado!' });
                return
            }

            //Buscamos el video
            const video = await Videos.findById(idV)
            if (!video) {
                res.status(409).json({ error: '¡El video no existe!' });
                return
            }

            // Buscar el historial del usuario con el video específico
            const historial = await Registro.findOne({ usuario: idU, videos: { $in: [idV] } });

            if (historial) {
                // Si ya existe un historial con ese video, retornamos un mensaje
                res.status(400).json({ error: '¡Ya viste este video!' });
                return
            }

            //Agregamos el video en el historial
            historial.videos = [video]

            // Guardar los datos
            const historialSuccess = await historial.save()

            // Verificar si alguna de las promesas falló
            if (!historialSuccess) {
                res.status(500).json({ error: '!No pudimos almacenar este video¡' });
                return
            }


            res.status(201).send('Video Finalizado')

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Elimnar videos de la lista
    static borrarVideo = async (req: Request, res: Response) => {
        try {
            const { idU, idV } = req.params;

            //Buscamos al usuario
            let usuario = await Usuario.findById(idU)
            if (!usuario) {
                res.status(409).json({ error: '¡Usuario no registrado!' });
                return
            }

            // Buscar el historial del usuario con el video específico
            const historial = await Registro.findOne({ usuario: idU, videos: { $in: [idV] } });
            if (!historial) {
                res.status(404).json({ error: 'No se encontró el historial con ese video.' });
                return;
            }

            // Eliminar el video del historial
            historial.videos = historial.videos.filter( i => i.toString() !== idV )

            //Guardamos cambios
            await historial.save() 


            res.status(201).send('ok')

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

}