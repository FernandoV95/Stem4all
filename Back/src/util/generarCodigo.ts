function LetraRandom() {
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('');
    const indice = Math.floor(Math.random() * abc.length);
    return abc[indice];
}

function NumRandom() {
    return Math.floor(Math.random() * 9);
}


export const generarCodigo= ()=> {
    let codigo = '';
    let i = 0;
        while(i<6){ 
            if(i%2 == 0){
             codigo+=LetraRandom()
            }else{
            codigo+=NumRandom()
            }
            i++;
    }
    return codigo 
} 