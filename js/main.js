// Click vagas e condição do status para abrir modal
$(document).ready(function(){
    console.log($("div.vaga-default"))
    $('.vaga-default').on("click", "a", function() {
        if($(this).data("status") == 'livre'){
            $('#ModalCadastro').modal('show')
            return
        }
        if($(this).data("status") == 'ocupada'){
            $('#ModalStatus').modal('show')
            return
        }
        if($(this).data("status") == 'bloqueada'){
            alert('Vaga está bloqueada')
            return
        }
      });
})

const data = {
    "vagas" : [
      {
        "id" : 1,
        "numero_vaga" : 1,
        "status_vaga" : "livre",
      }, {
        "id" : 2,
        "numero_vaga" : 2,
        "status_vaga" : "livre",
      }, {
        "id" : 3,
        "numero_vaga" : 3,
        "status_vaga" : "ocupada",
      }, {
        "id" : 4,
        "numero_vaga" : 4,
        "status_vaga" : "livre",
      }, {
        "id" : 5,
        "numero_vaga" : 5,
        "status_vaga" : "ocupada",
      }, {
        "id" : 6,
        "numero_vaga" : 6,
        "status_vaga" : "bloqueada",
      }, {
        "id" : 7,
        "numero_vaga" : 7,
        "status_vaga" : "livre",
      }, {
        "id" : 8,
        "numero_vaga" : 8,
        "status_vaga" : "ocupada",
      }, 
      {
        "id" : 9,
        "numero_vaga" : 9,
        "status_vaga" : "ocupada",
      }
    ]
  };
  
  // metodos create e render Vagas
  function createVagas(data) {
    return data.map(vaga => `
        <div class="col-sm">
            <div class="vaga-default ${vaga.status_vaga} " data-id="${vaga.id}"><a data-status="${vaga.status_vaga}" data-id="${vaga.id}" class="vaga-default btn-principal" href="#">${vaga.numero_vaga}</a></div>
        </div>`).join('');
  }

  function renderVagas(data, element) {
    const markup = createVagas(data);
    element.innerHTML = markup;
  };
  
  // trabalhando com o DOM e chamando os métodos
  const mapa_vagas = document.getElementById('mapa-vagas');

  renderVagas(data.vagas, mapa_vagas);