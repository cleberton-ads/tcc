var btnEntrar = document.getElementById('BtnEntrar')

// const url = 'http://localhost:3000/'
const url = 'https://backimpacta.herokuapp.com/'

btnEntrar.addEventListener('click', async function(){
  await fetch(url + 'login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({user: document.getElementById("InputUsuario").value, password: document.getElementById("InputSenha").value})
  })
  .then(async r => {
    let a = await r.json()
    console.log(a)
    window.localStorage.setItem('token', a.token)
    let b = r.status
    console.log(r.status)
    return (a, b)
  })
  .then(b => (b == 200) ? window.location = "./index.html" : alert('Login Inválido!'))
})


