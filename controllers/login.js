const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body;
    console.log(email, password);
   const userExist = await User.findOne({ email});
    
   if (!userExist) {
     return response.status(400).json({ error: 'email o contraseña incorrecto' });
   }

   if (!userExist.verified) {
    return response.status(400).json({ error: 'Tu cuenta no ha sido verificada.'});
   }
   
   const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
   

   if (!isCorrect) {
    return response.status(400).json({ error: 'email o contraseña incorrecto'});
   }

   const userForToken ={
    id: userExist.id,
   }

   const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d'
   });
   

    response.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
     });

     return response.sendStatus(200);
  
});

module.exports = loginRouter;