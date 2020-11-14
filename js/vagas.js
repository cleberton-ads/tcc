function createVagas(vagas) {
    return vagas.map(vaga => `<tr>
    <th scope="row">${vaga.id_vagas}</th>
    <td>${vaga.numero_vaga}</td>
    <td>${vaga.status}</td>
    <td >
        <span class="mdi mdi-update mdi-24px btn" style="color:#7CD65D;" id="btn-atualiza-vaga"></span>
    </td>
    </tr>`).join('');
}
  
function renderVagas(data) {
    const tabela = document.getElementById('table-vaga');
    const markup = createVagas(data)
    tabela.innerHTML = markup
};
  
async function getVagas(){
// const loadingmapa = $('#mapa-loading')

// loadingmapa.addClass('active')

await fetch(url+'vagas')
    .then(r => r.json())
    .then(json => {
    // loadingmapa.removeClass('active')
    return renderVagas(json)
    })
    .catch(err => {
        console.log(err)
    });
}
  
getVagas()