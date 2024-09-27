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
// db = connectToDatabase()
// Função para criar a tabela e inserir uma tarefa
// function initializeDatabase() {
//     db.serialize(() => {
//         // Cria a tabela se não existir
//         db.run("CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)");

//         // Insere uma nova tarefa
//         const stmt = db.prepare("INSERT INTO tarefas (nome) VALUES (?)");
//         stmt.run("Aprender Node.js");
//         stmt.finalize();

//         // Seleciona todas as tarefas
//         db.each("SELECT id, nome FROM tarefas", (err, row) => {
//             if (err) {
//                 console.error(err.message);
//             }
//             console.log(`${row.id}: ${row.nome}`);
//         });
//     });
//     // Fecha a conexão ao final
// db.close((err) => {
//     if (err) {
//         console.error('Erro ao fechar a conexão:', err.message);
//     } else {
//         console.log('Conexão com o banco de dados fechada.');
//     }

// });
// }

// // Inicializa o banco de dados
// initializeDatabase();

// Exporta a função para uso em outros módulos
module.exports = {
    connectToDatabase
};
