
export const cambiarRuta = (nombre:string,ruta:string)=>{
//"name": "alExperimento.mp4",
//"tempFilePath": "c:\\React\\Stem4all\\Videos\\tmp-1-1733893039271",
const auxRuta = ruta.split('tmp')[0]
return auxRuta + nombre
}