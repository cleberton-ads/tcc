const url = 'http://localhost:3000/'
//const url = 'https://backimpacta.herokuapp.com/'

const mapa_vagas = document.getElementById('mapa-vagas');

fetch(url + 'vagas')
    .then(r => r.json())
    .then(vagas =>{
      renderVagas(vagas, mapa_vagas)
    })

// metodos create e render Vagas
function createVagas(vagas) {
  return vagas.map(vaga => `
      <div class="col-sm">
          <div class="vaga-default ${vaga.status} " data-id="${vaga.id_vagas}"><a data-status="${vaga.status}" data-id="${vaga.id_vagas}" class="vaga-default btn-principal" href="#">${vaga.numero_vaga}</a></div>
      </div>`).join('');
}

function renderVagas(data, element) {
  const markup = createVagas(data);
  element.innerHTML = markup;
};

// Mudar status Vaga



// Cadastro de Veiculos
function createCadastro(opts){
  fetch(url + 'veiculo/cadastra/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: opts
  })
  .then(r => r.json())
  .then(r => console.log(r))

}

function submitCadastro(){
  const placa = document.getElementById('placa').value
  const modelo = document.getElementById('modelo').value
  const cor = document.getElementById('cor').value

  var dataVeiculo = {
    "placa": placa,
    "modelo": modelo,
    "cor": cor
  }
  
  var jsonVeiculo = JSON.stringify(dataVeiculo)

  createCadastro(jsonVeiculo)
  
}

