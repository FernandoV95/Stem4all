import type { Request, Response } from "express";
import Usuario from "../models/Users";
import { hashPassword } from "../util/Hash";
import Codigos from "../models/Codigos";
import { generarCodigo } from "../util/generarCodigo";
import { generarMatricula } from "../util/generarMatricula";

export class UsuarioCtl {

    //controlador para crear un usuario
    static nuevoUsuario = async (req: Request, res: Response) => {
        try {
            const { contraseña, email, apPat, apMat, nombres } = req.body

            // Prevenir duplicados
            const usr = await Usuario.findOne({ email })

            if (usr) {
                res.status(409).json({ error: '¡Este correo ya esta registrado!' });
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

            // Guardar usuario y codigo 
            const [usrSuccess, codSuccess] = await Promise.all([
                NvoUsuario.save(),
                cdg.save()
            ]);

            // Verificar si alguna de las promesas falló
            if (!usrSuccess || !codSuccess) {
                if (usrSuccess) {
                    await NvoUsuario.deleteOne();  // Elimina el usuario
                }
                if (codSuccess) {
                    await cdg.deleteOne();  // Elimina el código
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


}