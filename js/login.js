var form = new FormData(document.getElementById('login-form'));

var btnEntrar = document.getElementById('BtnEntrar')

btnEntrar.addEventListener('click', function(){
    fetch('http://localhost:3000/users')
    .then(r => r.json())
})
