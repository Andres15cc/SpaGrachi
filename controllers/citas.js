const express = require('express');
const citasRouter = express.Router();
const Cita = require('../models/citas'); 
const { userExtractor } = require('../middleware/auth');    

citasRouter.post('/', async (req, res) => {
    try {
        const { nombreCliente, email, telefono, estilista, servicio, fecha, hora } = req.body;


        const citaExistente = await Cita.findOne({ estilista, fecha, hora });

        if (citaExistente) {
            // Si la encontramos, respondemos con error 400 y NO guardamos nada
            return res.status(400).json({ 
                mensaje: 'Ese horario ya está reservado. Por favor, elige otra hora o fecha.' 
            });
        }
        
        const nuevaCita = new Cita({
            nombreCliente,
            email,
            telefono,
            estilista,
            servicio,
            fecha,
            hora: String(hora) // Lo guardamos como String puro
        });

        await nuevaCita.save();
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


// GET: Obtener todas las citas para el administrador
citasRouter.get('/', userExtractor , async (req, res) => {
    try {
        // Buscamos todas las citas y las ordenamos por fecha (las más recientes primero)
        const citas = await Cita.find({}).sort({ fecha: 1, hora: 1 });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
});


// ELIMINAR CITA
citasRouter.delete('/:id', userExtractor , async (req, res) => {
    try {
        await Cita.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Cita eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
});

// EDITAR ESTADO (O cualquier campo)
citasRouter.put('/:id', userExtractor , async (req, res) => {
    try {
        const citaActualizada = await Cita.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(citaActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
});


module.exports = citasRouter;