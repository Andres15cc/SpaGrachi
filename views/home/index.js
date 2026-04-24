// 2. Referencias a elementos del DOM
import { createNotification } from "/components/notification.js";
const selectServicios = document.getElementById('opciones');
const selectHoras = document.getElementById('hora-input');
const inputFecha = document.getElementById('fecha-input');
const form = document.getElementById('form');

// 1. Configuración de datos
const servicios = [
    { id: 1, nombre: "Uñas semi permanente" },
    { id: 2, nombre: "Uñas-Nivelacion" },
    { id: 3, nombre: "Sistema acrílico" },
    { id: 4, nombre: "Jelly" },
    { id: 5, nombre: "Corte de dama" },
    { id: 6, nombre: "Corte de caballero" },
    { id: 7, nombre: "Corte de niño" },
    { id: 8, nombre: "Secado de cabello" },
    { id: 9, nombre: "Hidratacion de cabello" },
    { id: 10, nombre: "Depilacion de cejas" },
    { id: 11, nombre: "Depilacion de bozo" },
    { id: 12, nombre: "Pestañas pelo a pelo" }
];

const horarios = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

// 3. Renderizar opciones dinámicamente
const cargarOpciones = () => {
    servicios.forEach(svc => {
        const option = document.createElement('option');
        option.value = svc.nombre; // Guardamos el nombre directamente
        option.textContent = svc.nombre;
        selectServicios.appendChild(option);
    });

    horarios.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        selectHoras.appendChild(option);
    });

    // Bloquear fechas pasadas
    inputFecha.min = new Date().toISOString().split("T")[0];
};

cargarOpciones();

// --- Envío del Formulario al Backend ---

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('form-btn');
    
    const datosCita = {
        nombreCliente: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        telefono: document.getElementById('telefono-input').value,
        servicio: selectServicios.value,
        fecha: inputFecha.value,
        hora: selectHoras.value
    };

    try {
        btn.disabled = true;
        btn.innerText = 'Agendando...';

        const response = await fetch('/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCita)
        });

        const resultado = await response.json();

        if (response.ok) {
            // ✅ NOTIFICACIÓN DE ÉXITO
            createNotification(false, `¡Cita agendada con éxito para ${resultado.nombreCliente}!`);
            form.reset();
        } else {
            // ❌ NOTIFICACIÓN DE ERROR (Dato inválido o duplicado)
            const mensajeError = resultado.error || 'Ese horario ya está reservado.';
            createNotification(true, mensajeError);
        }

    } catch (err) {
        console.error("Error en la conexión:", err);
        // ❌ NOTIFICACIÓN DE ERROR (Fallo de servidor)
        createNotification(true, "Hubo un problema al conectar con el servidor.");
    } finally {
        btn.disabled = false;
        btn.innerText = 'Agendar';
    }
});


 



// menú móvil    
 const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');

    const pathHamburger = "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
    const pathClose = "M6 18L18 6M6 6l12 12";

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.toggle('hidden');
        
        if (!isHidden) {
            menu.classList.add('flex');
            icon.setAttribute('d', pathClose);
        } else {
            menu.classList.remove('flex');
            icon.setAttribute('d', pathHamburger);
        }
    });

