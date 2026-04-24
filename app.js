require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const citasRouter = require('./controllers/citas');
const { userExtractor } = require('./middleware/auth');
const logoutRouter = require('./controllers/logout');

(async()=> { 

    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

//Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/citas',  citasRouter);


//Rutas fontend
app.use('/assets', express.static(path.resolve('assets')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/admin', userExtractor, express.static(path.resolve('views', 'admin')));
app.use('/', express.static(path.resolve('views', 'home')));











module.exports = app;