function zero(x){
    if (x < 10){
        x = '0' + x
    } return x
}

setInterval(function(){
    var data = new Date();

    var dia = data.getDate();
    var mes = data.getMonth();
    var ano = data.getUTCFullYear();

    var hora = data.getHours();
    var min = data.getMinutes();
    var seg = data.getSeconds();

    dia = zero(dia)
    min = zero(min)
    seg = zero(seg)

    var str_data = dia + '/' + (mes+1) + '/' + ano;
    var str_hora = hora + ':' + min + ':' + seg;

    var data_hora = str_data + ' ' + str_hora

    document.getElementById("hora-sistema").innerHTML = data_hora

},1000)

