import { Router } from "express";
import { InputErrors } from "../middleware/InputError";
import { Autenticacion } from "../controllers/AuthCtl";
import { body } from "express-validator";

const AutRt = Router()

//Logear
AutRt.post('/login',
    InputErrors,
    Autenticacion.login
)

//Validar la cuenta mediante Codigo 
AutRt.post('/verificar-cuenta',
    InputErrors,
    Autenticacion.verificarCuentaCodigo
)

//Envia el codigo para actualizar la contraseña
AutRt.post('/enviar-codigo-restablecer',
    InputErrors,
    Autenticacion.EnvCodReestCont
)

//Validar el codigo para cambiar contraseña
AutRt.post('/validar-codigo',
    InputErrors,
    Autenticacion.esValidoCodigo
)

//Cambiar la contraseña
AutRt.patch('/actualizar-contrasena/:codigo',
    body('contraseña').notEmpty().withMessage('¡Tu contraseña es obligatoria!'),
    body('confirmar_contraseña').custom((value, { req }) => {
        if (value !== req.body.pass) {
            throw new Error('¡Tu contraseña no coincide!')
        }
        return true
    }),
    InputErrors,
    Autenticacion.actualizarContraseña
)


export default AutRt