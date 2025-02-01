import type { Request, Response } from "express";
import Usuario from "../models/Users";

export class AdmindCtl {

    //Ver a todos los usuarios
    static verUsuarios = async (req: Request, res: Response) => {
        try {

            const usuarios = await Usuario.find({})
                .select('matricula numEmpleado verificado autorizado suspendido nombres apPat apMat tel email rol instAdscrp alcaldia genero añosDocencia carrera materias')

            if (!usuarios) {
                res.status(409).send('¡No hay usuarios registrados!')
                return
            }

            res.status(201).json(usuarios)

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Ver a un usuario por su id
    static verUsuarioId = async (req: Request, res: Response) => {
        try {
            const { idU } = req.params

            //Buscamos al usuario
            const usuario = await Usuario.findById(idU)
                .select('matricula numEmpleado verificado autorizado suspendido nombres apPat apMat tel email rol instAdscrp alcaldia genero añosDocencia carrera materias')

            if (!usuario) {
                res.status(409).send('¡Usuario no registrado!')
                return
            }

            res.status(201).json(usuario)

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Actualizar datos del usuario
    static actDatosUsuario = async (req: Request, res: Response) => {
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

}