function createVagas(vagas) {
    return vagas.map(vaga => `<tr>
    <th scope="row">${vaga.id_vagas}</th>
    <td>${vaga.numero_vaga}</td>
    <td>${vaga.status}</td>
    <td class="btn-bloquear">
        <a><span data-id="${vaga.id_vagas}" class="mdi mdi-block-helper mdi-20px btn" style="color:#FF3F50;" id="btn-bloquea-vaga"></span></a>
        <a><span data-id="${vaga.id_vagas}" class="mdi mdi-update mdi-20px btn" style="color:#7CD65D;" id="btn-desbloquear-vaga"></span></a>
    </td>
    </tr>`).join('');
}
  
function renderVagas(data) {
    const tabela = document.getElementById('table-vaga');
    const markup = createVagas(data)
    tabela.innerHTML = markup
};
  
async function getVagas(){
    await fetch(url+'vagas', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'x-access-token': window.localStorage.getItem('token')
        },
      })
        .then(r => r.json())
        .then(json => {
            return renderVagas(json)
        })
        .catch(err => {
            console.log(err)
        });
}

getVagas()

$(document).ready(function(){
    let vagaSelecionada = null
    $(document).on("click", "#btn-bloquea-vaga", function(event) {
        event.stopPropagation()
        const id = $(this).data("id")
        vagaSelecionada = {id}
        toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
        toastr["warning"](`<p>Deseja Bloquear a Vaga ${vagaSelecionada.id}?</p>
            <button class="btn" id="btn-sim-b">Sim</button>
            <button class="btn">Não</button>`)
    });
    $(document).on("click", "#btn-sim-b", async function(){
        await patchStatus(vagaSelecionada.id, 'bloqueado')
        toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
        toastr["success"]('Vaga Bloqueada')
        await getVagas()
    });
    
    $(document).on("click", "#btn-desbloquear-vaga", function(event) {
        event.stopPropagation()
        const id = $(this).data("id")
        vagaSelecionada = {id}
        toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
        toastr["warning"](`<p>Deseja desbloquear a Vaga ${vagaSelecionada.id}?</p>
            <button class="btn" id="btn-sim-d">Sim</button>
            <button class="btn">Não</button>`)
    });
    $(document).on("click", "#btn-sim-d", async function(){
        await patchStatus(vagaSelecionada.id, 'livre')
        toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
        toastr["success"]('Vaga Desbloqueada')
        await getVagas()
    });
})
