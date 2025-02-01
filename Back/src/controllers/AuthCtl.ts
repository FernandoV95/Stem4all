import type { Request, Response } from "express";
import Usuario from "../models/Users";
import { hashPassword, verifyPassword } from "../util/Hash";
import Codigos from "../models/Codigos";
import { generarCodigo } from "../util/generarCodigo";


export class Autenticacion {
    //Iniciar sesion
    static login = async (req: Request, res: Response) => {
        const { contraseña, email } = req.body

        //Buscamos el usuario
        const usuario = await Usuario.findOne({ email })

        //Buscamos el correo
        if (!usuario) {
            res.status(409).json({ error: '¡Correo no registrado!' });
            return
        }

        //Validamos la contraseña
        const esValidaContraseña = await verifyPassword(contraseña, usuario.contraseña)
        if (!esValidaContraseña) {
            const error = new Error('Contraseña Incorrecta')
            res.status(401).json({ error: error.message })
            return
        }


        //Verifica si la cuenta esta verificada
        if (!usuario.verificado) {
            const error = new Error('¡Cuenta no verificada!')
            res.status(401).json({ error: error.message })
            return
        }

        //Verificamos si la cuenta si tiene el acceso
        if (!usuario.autorizado) {
            const error = new Error('¡Aun no has sido autorizado!')
            res.status(401).json({ error: error.message })
            return
        }

        //Verificamos si la cuenta esta suspendida
        if (usuario.suspendido) {
            const error = new Error('¡Cuenta suspendida!')
            res.status(401).json({ error: error.message })
            return
        }


        //Enviamos un mensaje de bienvenida
        res.status(201).send('Bienvenido')
    }

    //Validamos la cuenta con el codigo
    static verificarCuentaCodigo = async (req: Request, res: Response) => {
        try {
            //Buscamos el codigo 
            const { codigo } = req.body
            const cdg = await Codigos.findOne({ codigo })

            if (!cdg) {
                const error = new Error('¡Codigo no valido!');
                res.status(401).json({ error: error.message });
                return
            }

            //Buscamos al dueño de ese codigo
            const usuario = await Usuario.findById(cdg.usuario)

            //Cambiamos el estado de verificado a verdadero
            usuario.verificado = true

            //Borramos el codigo y guardamos datos de usuario
            await Promise.allSettled([cdg.deleteOne(), usuario.save()])

            res.send('Cuenta verificada');

        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Envia el codigo para actualizar la contraseña
    static EnvCodReestCont = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const usr = await Usuario.findOne({ email })

            if (!usr) {
                const error = new Error('¡Correo no registrado!');
                res.status(401).json({ error: error.message });
                return
            }

            //verificamos si el usuario ya tiene un codigo
            const existe = await Codigos.findOne({ usuario: usr.id })
            if (existe) {
                const error = new Error('¡Tu codigo anterior no ha caducado!');
                res.status(401).json({ error: error.message });
                return
            }

            //Genera un codigo
            const cdg = new Codigos;
            cdg.codigo = generarCodigo()
            cdg.usuario = usr.id

            //Guardamos el token
            await cdg.save()

            res.status(201).send('Hemos enviado un codigo a tu correo')
        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Validar el codigo para cambiar contraseña
    static esValidoCodigo = async (req: Request, res: Response) => {
        try {
            const { codigo } = req.body
            const cdg = await Codigos.findOne({ codigo })

            if (!cdg) {
                const error = new Error('¡Codigo NO valido!');
                res.status(401).json({ error: error.message });
                return
            }

            res.status(201).send('Ingresa tu nueva contraseña')
        } catch (error) {
            res.status(500).json({ error: error.message })
            return
        }
    }

    //Cambiar contraseña mediante el codigo
    static actualizarContraseña = async (req: Request, res: Response) => {
        try {
            const { contraseña } = req.body
            const { codigo } = req.params
            const cdg = await Codigos.findOne({ codigo })

            //validamos el codigo
            if (!cdg) {
                const error = new Error('¡Codigo no valido!');
                res.status(401).json({ error: error.message });
                return
            }

            //Buscamos al usuario
            const usr = await Usuario.findById(cdg.usuario)

            //Hasear la contraseña
            usr.contraseña = await hashPassword(contraseña)

            //Guardamos los cambios
            const [userSucess, codeSucess] = await Promise.allSettled([usr.save(), cdg.deleteOne()])

            // Si alguno falló, manejamos el error
            if (!userSucess || !codeSucess) {
                const error = new Error('Error al actualizar la contraseña');
                res.status(500).json({ error: error.message });
                return;
            }
            res.status(201).send('Contraseña actualizada')

        } catch (error) {
            res.status(404).json({ error: error.message })
            return
        }
    }
}