function zero(x){
  if (x < 10){
      x = '0' + x
  } return x
}

function DataHora(){
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

  const str_hora = hora + ':' + min + ':' + seg;
  const str_data = dia + '/' + (mes+1) + '/' + ano;

  const data_hora = str_data + ' ' + str_hora

  return data_hora
}

setInterval(function(){
  document.getElementById("hora-sistema").innerHTML = DataHora()
},1000)


// Click vagas e condição do status para abrir modal
$(document).ready(function(){
  $(document).on("click", ".vaga-default", function() {
    if($(this).data("status") == 'livre'){
      document.getElementById('formCadastro').reset()
      $('#ModalCadastro').modal('show')
      const horaAloc = $('#horario-entrada')
      horaAloc.val(DataHora()) 
      return
    }
    if($(this).data("status") == 'ocupado'){
      document.getElementById('formStatus').reset()
      $('#ModalStatus').modal('show')
      getVeiculo(vagaSelecionada.id)
      return
    }
    if($(this).data("status") == 'bloqueado'){
      toastr.options = {"positionClass": "toast-top-center"}
      toastr["error"]("Vaga está Bloqueada")
      return
    }
  });

  $(document).on('click', '.config', function(event){ 
    event.stopPropagation();
  });
})

// const url = 'http://localhost:3000/'
const url = 'https://backimpacta.herokuapp.com/'

// metodos create e render Vagas
function createVagas(vagas) {
  return vagas.map(vaga => `
      <div class="col">
          <div class="vaga-default ${vaga.status}"><a id="vaga${vaga.id_vagas}" data-status="${vaga.status}" data-id="${vaga.id_vagas}" class="vaga-default btn-principal" href="#">${vaga.numero_vaga}</a></div>
      </div>`).join('');
}

function renderVagas(data) {
  const mapa_vagas = document.getElementById('mapa-vagas');
  const markup = createVagas(data)
  mapa_vagas.innerHTML = markup
};

async function getVagas(){
  const loadingmapa = $('#mapa-loading')

  loadingmapa.addClass('active')

  await fetch(url+'vagas')
    .then(r => r.json())
    .then(json => {
      loadingmapa.removeClass('active')
      return renderVagas(json)
    })
    .catch(err => {
        console.log(err)
    });
}

getVagas()

//Selecionar Vaga
let vagaSelecionada = null

$(document).on("click", "a.vaga-default", function(event) {
  event.stopPropagation()
  const id = $(this).data("id")
  const status = $(this).data("status")
  vagaSelecionada = {id, status}
})

// Mudar status Vaga
async function patchStatus(id, status){
    await fetch(url+`vagas/update/${status}/${id}/`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({status: status})
    })
        .then(r => r.json())
        .then(json => console.log(json))
        .catch(err => {
            console.log(err)
        });
}

async function alterarVaga(){
  let newstatus = ''

  if(vagaSelecionada.status == 'livre'){
    newstatus = 'ocupado';
  }

  if(vagaSelecionada.status == 'ocupado'){
    newstatus = 'livre';
  }

  await patchStatus(vagaSelecionada.id, newstatus)
}

// Cadastro de Veiculos
async function postCadastro(opts){
  await fetch(url + 'veiculo/cadastra/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: opts
    })
    .then(r => r.json())
    .then(json => obteridCarro(json.insertId))
}

function validarCamposCadastro(){
  const placa = document.getElementById('placa')
  const modelo = document.getElementById('modelo')
  const cor = document.getElementById('cor')

  if(placa.value == '' || placa.value.length == 0){
    placa.focus()
    toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
    toastr["warning"]("Preencha a Placa do Veículo")
    return
  }

  if(modelo.value == '' || modelo.value.length == 0){
    modelo.focus()
    toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
    toastr["warning"]("Preencha o Modelo do Veículo")
    return
  }

  if(cor.value == '' || cor.value.length == 0){
    cor.focus()
    toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
    toastr["warning"]("Preencha a Cor do Veículo")
    return
  }
  
  const dataVeiculo = {
    "placa": placa.value,
    "modelo": modelo.value,
    "cor": cor.value
  }

  return dataVeiculo
}

async function createCadastro(){ 
  const jsonVeiculo = JSON.stringify(validarCamposCadastro())

  await postCadastro(jsonVeiculo)
}

async function obteridCarro(res){
  let idCarro = res
  await createAlocacao(idCarro)
}

//Cadastro Alocacao
async function postAlocacao(opts){
    await fetch(url + 'alocacao/cadastra/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: opts
    })
    .then(r => r.json())
    .then(json => console.log(json))
}

function formataData(data){
  separar = data.split(' ')

  data_separada = separar[0]
  hora = separar[1]

  dataamer = data_separada.split('/')
  
  dia = dataamer[0]
  mes = dataamer[1]
  ano = dataamer[2]

  datanova = ano + '-' + mes + '-' + dia

  return datanova + ' ' + hora
}

async function createAlocacao(id){
  const hora_entrada = document.getElementById('horario-entrada').value

  const entrada = formataData(hora_entrada)

  var dataAlocacao = {
    "entrada": entrada,
    "veiculo_id_veiculo": id,
    "vagas_id_vagas": vagaSelecionada.id,
    "usuarios_id_usuarios": 1
    }

  var jsonAlocacao = JSON.stringify(dataAlocacao)
  
  await postAlocacao(jsonAlocacao)
}

var enviarCadastro = document.getElementById('btnCadastrar')
enviarCadastro.addEventListener('click', async function(){
  if(!validarCamposCadastro()){
    console.log('Erro')
    return
  }
  vagaAlocada()
  await createCadastro()
  await alterarVaga()
  await getVagas()
})

function vagaAlocada(){
    $('#ModalCadastro').modal('hide')
    toastr.options = {"positionClass": "toast-top-center"}
    toastr["success"]("Vaga Alocada com sucesso")
}

async function getPlaca(placa){
  await fetch(url + `buscaVeic/${placa}`)
  .then(r => r.json())
  .then(json => renderPlaca(json.modelo, json.cor))
}

function renderPlaca(modelo, cor){
  const inputModelo = document.getElementById('modelo')
  const inputCor = document.getElementById('cor')

  inputModelo.value = modelo
  inputCor.value = cor
}

async function buscarPlaca(){
  const placa = document.getElementById('placa').value
  if(placa == ''){
    toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
    toastr["warning"]("Preencha a Placa do Veículo")
  } else {
    await console.log(getPlaca(placa))
  }
}

const btnBuscarPlaca = document.getElementById('btnBuscar')
btnBuscarPlaca.addEventListener('click', async function(){
  await buscarPlaca()
})

async function getVeiculo(id){
  let veiculo
  await fetch(url+`vagas/${id}`)
  .then(r => r.json())
  .then(json => veiculo = json[0])
  return renderVeiculo(veiculo)
}

function renderVeiculo(data){
  const placa = document.getElementById('status-placa')
  const modelo = document.getElementById('status-modelo')
  const cor = document.getElementById('status-cor')
  const hora_entrada = document.getElementById('status-entrada')

  placa.value = data.placa
  modelo.value = data.modelo
  cor.value = data.cor
  hora_entrada.value = retornarData(data.entrada)
}

async function getPreco(id, bandeira){
  await fetch(url + `vagas/fechamento/${id}?bandeira=${bandeira}`)
  .then(r => r.json())
  .then(json => renderPreco(json))
}

function renderPreco(data){
  const total = document.getElementById('status-total')

  total.value = formataMoeda(data.price)
}

function formataMoeda(moeda){
  return parseInt(moeda).toLocaleString('pt-br',{ style: 'currency', currency: 'BRL' })
}

function retornarData(data){
  separar = data.split('T')

  data_separada = separar[0]
  hora_separada = separar[1]

  hora = hora_separada.split('.')

  dataamer = data_separada.split('-')
  
  dia = dataamer[2]
  mes = dataamer[1]
  ano = dataamer[0]

  datanova = dia + '/' + mes + '/' + ano

  return datanova + ' ' + hora[0]
}

const bntPagamento = document.getElementById('btnCalcular')
bntPagamento.addEventListener('click', function(){
  const preco = formataMoeda(5)
  const saida = document.getElementById('status-saida')
  saida.value = DataHora()
  const inputpreco = document.getElementById('status-preco').value = preco
  bandeira = inputpreco.split('R$')
  getPreco(vagaSelecionada.id, parseInt(bandeira[1]))
})

const finalizaAlocacao = document.getElementById('btnFinalziar')
finalizaAlocacao.addEventListener('click', async function(){
  vagaLiberada()
  await alterarVaga()
  await getVagas()
})

function vagaLiberada(){
  $('#ModalStatus').modal('hide')
  toastr.options = {"positionClass": "toast-top-center"}
  toastr["success"]("Vaga está Liberada")
}