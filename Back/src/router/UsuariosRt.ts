import { Router } from "express";
import { InputErrors } from "../middleware/InputError";
import { UsuarioCtl } from "../controllers/UserCtl";

const UsuariosRt = Router()


//Crear un usuario
UsuariosRt.post('/nuevo',
    InputErrors,
    UsuarioCtl.nuevoUsuario
)

export default UsuariosRt