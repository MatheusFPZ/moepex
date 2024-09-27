// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Função para criar uma conexão com o banco de dados
function connectToDatabase() {
    const dbPath = path.join(__dirname, '../meu_banco.db');
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });

    return db;
}


// Exporta a função para uso em outros módulos
module.exports = {
    connectToDatabase
};
