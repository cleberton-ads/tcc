function createVagas(vagas) {
    return vagas.map(vaga => `<tr>
    <th scope="row">${vaga.id_vagas}</th>
    <td>${vaga.numero_vaga}</td>
    <td>${vaga.status}</td>
    <td class="btn-bloquear">
        <a><span data-id="${vaga.id_vagas}" class="mdi mdi-block-helper mdi-20px btn" style="color:#FF3F50;" id="btn-bloquea-vaga"></span></a>
    </td>
    </tr>`).join('');
}
  
function renderVagas(data) {
    const tabela = document.getElementById('table-vaga');
    const markup = createVagas(data)
    tabela.innerHTML = markup
};
  
async function getVagas(){
    await fetch(url+'vagas')
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
        toastr["warning"](`<p>Deseja Bloquar a Vaga ${vagaSelecionada.id}</p>
            <button class="btn" id="btn-sim">Sim</button>
            <button class="btn">Não</button>`)
    });
    $(document).on("click", "#btn-sim", async function(){
        await patchStatus(vagaSelecionada.id, 'bloqueado')
        toastr.options = {"positionClass": "toast-top-center", "preventDuplicates": true,}
        toastr["success"]('Vaga Bloqueada')
        await getVagas()
    })
})