const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const axios = require("axios");

usersRouter.post("/", async (request, response) => { 
  const { name, email, password } = request.body;

  // 1. Validación de campos requeridos
  if (!name || !email || !password) {
    return response.status(400).json({ error: "Todos los espacios son requeridos" });
  }

  // 2. Seguridad: Verificar duplicados antes de gastar créditos de API
  const userExist = await User.findOne({ email });
  if (userExist) {
    return response.status(400).json({ error: "El email ya se encuentra en uso" });
  }

  try {
    // 3. Verificación de Email Real
    const API_KEY = process.env.EMAIL_API_KEY; 
    const url = `https://apps.emaillistverify.com/api/verifyEmail?secret=${API_KEY}&email=${email}`;
    
    console.log("Consultando API para el correo:", email);
    const { data } = await axios.get(url);
    console.log("Respuesta de la API:", data);

    const esValido = data === "ok" || data === "ok_for_all" || data === "accept_all";

    if (!esValido) {
      return response.status(400).json({ error: "El correo no es válido o está inactivo." });
    }

    // 4. Seguridad: Hash de contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 5. Creación del Usuario
    const newUser = new User({
      name,
      email,
      passwordHash,
      verified: true, 
    });

    // 6. Guardado en DB
    const savedUser = await newUser.save();
    console.log("Administrador guardado:", savedUser.email);

    return response.status(201).json({ message: "Usuario creado correctamente" });
    
  } catch (error) {
    console.error("Error en el proceso de registro:", error.message);
    return response.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = usersRouter;