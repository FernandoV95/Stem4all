

export const generarMatricula = (apPat: string, apMat: string, nombres: string) => {
  let complement = Math.floor(Math.random() * 900000) + 100000;
  let anio = new Date().getFullYear();
  let matricula = ''
  const auxPat = apPat.slice(0, 2).toLowerCase();
  const auxMat = apMat.charAt(0).toLowerCase();
  const aux = nombres.split(' ');
  let auxNombres = '';
  aux.map((i: string) => {
    auxNombres += i.charAt(0).toLowerCase()
  });
  matricula = auxPat + auxMat + auxNombres + anio + complement
  return matricula
}