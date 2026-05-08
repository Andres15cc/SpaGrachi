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
        required: [true, 'El teléfono es obligatorio'],
        trim: true
    },
    servicio: {
        type: String, 
        required: true,
    },
    estilista: {
        type: String,
        required: [true, 'El estilista es obligatorio'],
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
        enum: ['pendiente', 'completada'],
        default: 'pendiente'
    },
 
}, {
    timestamps: true // Esto crea automáticamente campos 'createdAt' y 'updatedAt'
});
 

// Exportar el modelo

const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita;