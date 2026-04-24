import { createNotification } from "/components/notification.js";

const form = document.querySelector("#form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const matchInput = document.querySelector("#match-input");
const formBtn = document.querySelector("#form-btn");
const notification = document.querySelector('#notification');

//Reject validation
const NAME_VALIDATION =
  /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;
// \u00f1\u00d1= Permite la ñ y la Ñ dentro del nombre.
// \s* = Permite espacios en blanco antes del siguiente nombre.
//-ÿ = Esto es un truco para incluir casi todos los caracteres latinos con tildes (como á, é, ö, etc.).
const EMAIL_VALIDATION =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const PASSWORD_VALIDATION =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/;
//.* = cualquier carácter, cualquier cantidad de veces
// \d = símbolo especial para "digit" (dígito). Representa cualquier número del 0 al 9.
// (?= ) Mira hacia adelante en el texto y asegúrate de que lo que sigue esté ahí

//Validations 
// Variables que guardan el estado de cada input (empiezan en false porque están vacíos)
let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

const validation = (input, regexValidation) => {
 // Habilita el botón solo si TODAS las validaciones son true
  formBtn.disabled = nameValidation && emailValidation && passwordValidation && matchValidation ? false : true;
// Si el campo está vacío, quita todos los colores de validación
  if (input.value === "") {
    input.classList.remove("outline-red-700", "outline-2", "outline");
    input.classList.remove("outline-green-700", "outline-2", "outline");
    input.classList.add("focus:outline-indigo-700");
  } else if (regexValidation) {
     // Si el texto SÍ cumple pone el borde verde
    input.classList.remove("focus:outline-indigo-700");
    input.classList.add("outline-green-700", "outline-2", "outline");
    input.classList.remove("outline-red-700");
  } else if (!regexValidation) {
    // Si el texto NO cumple, pone el borde rojo
    input.classList.remove("focus:outline-indigo-700");
    input.classList.remove("outline-green-700", "outline-2", "outline");
    input.classList.add("outline-red-700", "outline-2", "outline");
  }
};

//Events
//Escuchan los diferentes inputs al escribirlos y los verifica
nameInput.addEventListener("input", e => {
  nameValidation = NAME_VALIDATION.test(e.target.value);
  validation(nameInput, nameValidation);
});

emailInput.addEventListener("input", e => {
  emailValidation = EMAIL_VALIDATION.test(e.target.value);
  validation(emailInput, emailValidation);
});

passwordInput.addEventListener("input", e => {
  passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
  matchValidation = e.target.value === matchInput.value ;
  validation(passwordInput, passwordValidation);
  validation(matchInput, matchValidation);
});

matchInput.addEventListener("input", e => {
  matchValidation = e.target.value === passwordInput.value ;
  validation(matchInput, matchValidation);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  
  // Bloqueamos el botón para evitar múltiples envíos mientras la API responde
  formBtn.disabled = true;
  formBtn.innerHTML = "Registrando..."; 

  try {
    const newUser = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    const { data } = await axios.post('/api/users', newUser);
    
    // ÉXITO: Usamos data.message (como lo configuramos en el backend)
    createNotification(false, data.message || "Usuario creado.");

    // Limpieza total
    form.reset(); // Método nativo más rápido para limpiar todo el form
    
    // Reseteamos estados de validación
    nameValidation = emailValidation = passwordValidation = matchValidation = false;
    
    // Llamamos a la validación con campos vacíos para quitar los colores
    [nameInput, emailInput, passwordInput, matchInput].forEach(input => validation(input, false));

  } catch (error) {
    // ERROR: Cambiamos a true y accedemos a .error
    // Usamos un "Optional Chaining" (?.) por si el servidor no responde
    const msg = error.response?.data?.error || "Error de conexión con el servidor";
    createNotification(true, error.response.data.error);
    
    // Reactivamos el botón en caso de error para que el usuario pueda corregir
    formBtn.disabled = false;
  } finally {
    formBtn.innerHTML = "Registrar";
  }
});