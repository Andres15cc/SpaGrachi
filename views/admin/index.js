// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('modalCita');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnCerrar = document.getElementById('btnCerrarModal');
const formAdmin = document.getElementById('formAdmin');
const inputFechaAdmin = document.getElementById('admin-fecha');
import { createNotification } from "/components/notification.js";

// Configuración de datos
const horariosAdmin = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const serviciosAdmin = [ 
     "Uñas semi permanente" ,
     "Uñas-Nivelacion",
     "Sistema acrílico",
     "Jelly",
     "Corte de dama",
     "Corte de caballero",
     "Corte de niño" ,
     "Secado de cabello",
     "Hidratacion de cabello",
     "Depilacion de cejas" ,
     "Depilacion de bozo" ,
     "Pestañas pelo a pelo" ];

const selectHoraAdmin = document.getElementById('admin-hora');
const selectSvcAdmin = document.getElementById('admin-servicio');

// Llenar selectores
horariosAdmin.forEach(h => {
    let opt = new Option(h, h);
    selectHoraAdmin.add(opt);
});

serviciosAdmin.forEach(s => {
    let opt = new Option(s, s);
    selectSvcAdmin.add(opt);
});

// Bloquear fechas pasadas en el modal
if(inputFechaAdmin) {
    inputFechaAdmin.min = new Date().toISOString().split("T")[0];
}

// Abrir/Cerrar Modal (Ajustado para evitar conflicto flex/hidden)
btnAbrir.onclick = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // Activamos flex para centrar
};

btnCerrar.onclick = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// Cerrar modal al hacer clic fuera del cuadro blanco
window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};


// Enviar formulario
formAdmin.onsubmit = async (e) => {
    e.preventDefault();
    
    const nuevaCita = {
        nombreCliente: document.getElementById('admin-nombre').value,
        email: document.getElementById('admin-email').value,
        telefono: document.getElementById('admin-telefono').value,
        servicio: selectSvcAdmin.value,
        fecha: inputFechaAdmin.value,
        hora: selectHoraAdmin.value
    };

    try {
        const res = await fetch('/api/citas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaCita)
        });

        const data = await res.json();

        if (res.ok) {
        
            createNotification(false, 'Cita registrada con éxito');
            
            // Lógica del modal y formulario
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            formAdmin.reset();
            cargarCitas(); // Recargar la tabla automáticamente
        } else {
           
            // Usamos data.mensaje o data.error según lo que devuelva tu backend
            createNotification(true, data.mensaje || data.error || 'Error al guardar la cita');
        }
    } catch (err) {
        console.error("Error en la petición:", err);
        createNotification(true, 'No se pudo conectar con el servidor');
    }
};


// FUNCIÓN PARA ELIMINAR
const eliminarCita = async (id) => {
    // Reemplazamos el confirm nativo por el nuestro
    const confirmado = await mostrarConfirmacion();
    
    if (confirmado) {
        try {
            const res = await fetch(`/api/citas/${id}`, { method: 'DELETE' });
            
            if (res.ok) {
                createNotification(false, 'Cita eliminada correctamente');
                cargarCitas(); 
            } else {
                createNotification(true, 'No se pudo eliminar la cita');
            }
        } catch (error) {
            createNotification(true, 'Error de conexión');
        }
    }
};

window.eliminarCita = eliminarCita;



// FUNCIÓN PARA CAMBIAR ESTADO 
const cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'pendiente' ? 'completada' : 'pendiente';
    
    try {
        const res = await fetch(`/api/citas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (res.ok) {
            cargarCitas(); // Recargar tabla
        }
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
}; window.cambiarEstado = cambiarEstado;

const btnLogout = document.getElementById('btnLogout');

//confirmacion para borrar cita
const modalConfirm = document.getElementById('custom-confirm');
const btnCancel = document.getElementById('cancel-delete');
const btnConfirm = document.getElementById('confirm-delete');

// Función para reemplazar el confirm
const mostrarConfirmacion = () => {
    return new Promise((resolve) => {
        // Mostrar modal con flex
        modalConfirm.classList.remove('hidden');
        modalConfirm.classList.add('flex');

        const cerrar = (valor) => {
            modalConfirm.classList.add('hidden');
            modalConfirm.classList.remove('flex');
            resolve(valor); // Retorna true o false
        };

        btnConfirm.onclick = () => cerrar(true);
        btnCancel.onclick = () => cerrar(false);
        
        // También cerrar si hacen clic fuera del cuadro blanco
        modalConfirm.onclick = (e) => {
            if (e.target === modalConfirm) cerrar(false);
        };
    });
};

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        try {
            // Llamamos al endpoint que acabamos de cambiar a POST
            const respuesta = await axios.post('/api/logout', {}, { 
                withCredentials: true 
            });

            if (respuesta.status === 204) {
                // Redirigir al login una vez que la cookie fue borrada
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Si el error es 401, significa que la sesión ya no existía
            window.location.href = '/';
        }
    });
}

const cargarCitas = async () => {
    const tbody = document.getElementById('lista-citas');
    
    try {
        const respuesta = await fetch('/api/citas');
        const citas = await respuesta.json();

        tbody.innerHTML = ''; // Limpiar tabla

       citas.forEach(cita => {
    // 1. Definir estilos según el estado
    let configEstado = {
        clase: "bg-gray-100 text-gray-700", // Default
        texto: cita.estado
    };

    const estadoLimpio = cita.estado.toLowerCase();

    if (estadoLimpio === 'pendiente') {
        configEstado.clase = "bg-yellow-100 text-yellow-700 border-yellow-200";
    } else if (estadoLimpio === 'completada') {
        configEstado.clase = "bg-green-100 text-green-700 border-green-200";
    } 

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 font-bold">${cita.nombreCliente}</p>
            <p class="text-gray-600 text-xs">${cita.email}</p>
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            ${cita.telefono}
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            ${cita.servicio}
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            ${new Date(cita.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span class="font-medium">${cita.hora}</span>
        </td>
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span class="px-3 py-1 font-bold text-[10px] uppercase rounded-full border ${configEstado.clase}">
                ${cita.estado}
            </span>
        </td>
        
        <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
            <div class="flex justify-center gap-2">
                <button onclick="cambiarEstado('${cita._id}', '${cita.estado}')" 
                    class="text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition-all duration-200 border border-blue-100" 
                    title="Alternar Estado">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                <button onclick="eliminarCita('${cita._id}')" 
                    class="text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg transition-all duration-200 border border-rose-100" 
                    title="Eliminar Cita">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </td>
    `;
    tbody.appendChild(fila);
}); 

    } catch (error) {
        console.error('Error al cargar citas:', error);
    }
};

// Iniciar carga de la tabla
cargarCitas();