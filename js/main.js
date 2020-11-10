// const url = 'http://localhost:3000/'
const url = 'https://backimpacta.herokuapp.com/'

// metodos create e render Vagas
function createVagas(vagas) {
  return vagas.map(vaga => `
      <div class="col-sm">
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

async function createCadastro(){
  const placa = document.getElementById('placa').value
  const modelo = document.getElementById('modelo').value
  const cor = document.getElementById('cor').value

  var dataVeiculo = {
    "placa": placa,
    "modelo": modelo,
    "cor": cor
  }
  
  var jsonVeiculo = JSON.stringify(dataVeiculo)

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

async function createAlocacao(id){
  const hora_entrada = document.getElementById('horario-entrada').value

  var dataAlocacao = {
    "entrada": hora_entrada,
    "veiculo_id_veiculo": id,
    "vagas_id_vagas": vagaSelecionada.id,
    "usuarios_id_usuarios": 1
    }

  var jsonAlocacao = JSON.stringify(dataAlocacao)
  
  await postAlocacao(jsonAlocacao)
}

var enviarCadastro = document.getElementById('btnCadastrar')
enviarCadastro.addEventListener('click', async function(){
  await createCadastro()
  await alterarVaga()
  await getVagas()
  document.getElementById("formCadastro").reset()
})

$('#btnCadastrar').on('click', function(){
  $('#ModalCadastro').modal('hide')
  toastr.options = {"positionClass": "toast-top-center"}
  toastr["success"]("Vaga Alocada com sucesso")
})
