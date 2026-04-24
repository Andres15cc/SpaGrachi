const logoutRouter = require('express').Router();

// CAMBIO: de .get a .post
logoutRouter.post('/', async (request, response) => {
    const cookies = request.cookies; 
     
    if (!cookies?.accessToken) { 
        return response.sendStatus(401);
    }

    response.clearCookie('accessToken', {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict', // Recomendado para evitar ataques CSRF
      path: '/'           // Asegura que limpie la cookie en todo el sitio
    });

    return response.sendStatus(204);
});

module.exports = logoutRouter;