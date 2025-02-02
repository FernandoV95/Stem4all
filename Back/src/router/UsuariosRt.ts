import { Router } from "express";
import { InputErrors } from "../middleware/InputError";
import { UsuarioCtl } from "../controllers/UserCtl";

const UsuariosRt = Router()


//Crear un usuario
UsuariosRt.post('/nuevo',
    InputErrors,
    UsuarioCtl.nuevoUsuario
)

//Agregar video a la lista
UsuariosRt.patch('/:idU/agregar-video/:idV',
    InputErrors,
    UsuarioCtl.agregarVideo
)

//Borrar video de la lista
UsuariosRt.delete('/:idU/borrar-video/:idV',
    InputErrors,
    UsuarioCtl.borrarVideo
)


export default UsuariosRt