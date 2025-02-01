import { Router } from "express";
import { InputErrors } from "../middleware/InputError";
import { AdmindCtl } from "../controllers/AdmindCtl";

const AdministracionRt = Router()

//Ver a los usuarios 
AdministracionRt.get('/usuarios',
    InputErrors,
    AdmindCtl.verUsuarios
)

//ver a un usuario por su id
AdministracionRt.get('/usuario/:idU',
    InputErrors,
    AdmindCtl.verUsuarioId
)

//Actualizar datos del usuario
AdministracionRt.patch('/usuario/actualizar/:idU',
    InputErrors,
    AdmindCtl.actDatosUsuario
)



export default AdministracionRt
