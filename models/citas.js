const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    nombreCliente: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    servicio: {
        type: String, 
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'completada'],
        default: 'pendiente'
    },
    notas: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Esto crea automáticamente campos 'createdAt' y 'updatedAt'
});
 

// Exportar el modelo

const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita;