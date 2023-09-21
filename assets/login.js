const formulaire = document.getElementById("form")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const messageError = document.querySelector("#error")

const login = async (data) => {
    const user = {
        email : data.get('email'),
        password: data.get('password'),
    }

    return await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
}

formulaire.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(formulaire)
    const response = await login(data)
    const user = await response.json()
    console.log(response)

    if (response.status === 401 || response.status === 404) {
        messageError.style.display = 'flex'
        messageError.innerHTML = 'Authentification échoué, veuillez réessayer.';
        setTimeout(() => {
            messageError.innerHTML = ""
            messageError.style.display = 'none';
        }, 3000)
    }

    if (response.status === 200) {
        sessionStorage.setItem('token', user.token)
        window.location.assign('/index.html')
    }
})