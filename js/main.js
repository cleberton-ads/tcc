fetch('http://localhost:3000/vagas')
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

// trabalhando com o DOM e chamando os métodos
const mapa_vagas = document.getElementById('mapa-vagas');


