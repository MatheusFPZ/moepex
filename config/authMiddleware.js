// authMiddleware.js
const jwt = require('jsonwebtoken');

// Chave secreta para assinar o token (guarde-a em um lugar seguro)
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // O token geralmente é passado no cabeçalho Authorization como "Bearer TOKEN"

    if (!token) return res.sendStatus(401); // Se não houver token, retorne 401 Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token não for válido, retorne 403 Forbidden
        req.user = user; // Se o token for válido, anexe o usuário à requisição
        next(); // Continue para a próxima função de middleware
    });
}

module.exports = authenticateToken;