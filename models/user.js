const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // para que no haya duplicados
    },
    passwordHash: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    // definimos el rol aquí mismo
    role: {
        type: String,
        default: 'admin',
        enum: ['admin'] // Por ahora solo se permite este valor
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;