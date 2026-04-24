const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken;

        if (!token) {
            // El return aquí es vital para cortar la ejecución
            return response.sendStatus(401);
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Buscamos al usuario. 
        // Tip: Si solo necesitas el ID para validar, podrías saltarte este paso 
        // o pedir solo campos necesarios con .select('name role')
        const user = await User.findById(decoded.id);

        if (!user) {
            return response.sendStatus(404);
        }

        request.user = user;
        
        
        if (user.role !== 'admin') {
            return response.status(403).json({ error: 'Acceso denegado: No eres administrador' });
         }
    
        next();

    } catch (error) {
        console.error('Error en userExtractor:', error.message);
        // Si el token es inválido o expiró, enviamos 403
        return response.sendStatus(403);
    }
};

module.exports = { userExtractor };