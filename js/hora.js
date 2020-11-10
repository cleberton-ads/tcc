function zero(x){
    if (x < 10){
        x = '0' + x
    } return x
}

function HoraCerta(){
    const data = new Date();

    let dia = data.getDate();
    const mes = data.getMonth();
    const ano = data.getUTCFullYear();

    const hora = data.getHours();
    let min = data.getMinutes();
    let seg = data.getSeconds();

    dia = zero(dia)
    min = zero(min)
    seg = zero(seg)

    const str_data = dia + '/' + (mes+1) + '/' + ano;
    const str_hora = hora + ':' + min + ':' + seg;

    const data_hora = str_data + ' ' + str_hora

    return data_hora
}

setInterval(function(){
    document.getElementById("hora-sistema").innerHTML = HoraCerta()
},1000)

