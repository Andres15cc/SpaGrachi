const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const user = { 
            email: emailInput.value,
            password: passwordInput.value
        };
       
        await axios.post('/api/login', user);
        window.location.pathname = `/admin/`; //Es un objeto del navegador que controla la dirección URL actual, 
    } catch (error) {
        console.log(error);
        errorText.innerHTML = error.response.data.error; //Inyecta ese mensaje de error directamente en el HTML para que el usuario pueda leer en rojo: "Contraseña incorrecta".
    }
});