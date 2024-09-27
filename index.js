const express = require('express');
const app = express();
const PORT = 3000;
const {connectToDatabase} = require('./banco/db')
const authenticateToken = require('./config/authMiddleware'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const db = connectToDatabase()

app.use(express.json());

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];


// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).send('Credenciais inválidas');
    }

    // Se as credenciais estiverem corretas, gera um token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Rota protegida
app.get('/protected', authenticateToken, (req, res) => {
    res.send(`Olá, usuário ${req.user.id}! Esta é uma rota protegida.`);
});


// Criar uma nova tarefa
app.post('/tasks', (req, res) => {
    const nome=  req.body.nome
    

   const stmt =  db.prepare("INSERT INTO tarefas (NOME) VALUES(?)")
    stmt.run(nome, function(err){
        if(err){
            console.log('erro ao inserir')
            return res.status(500).json({error: 'erro ao inserir tarefa'})
        }

        res.status(201).json({id:this.lastID, nome});
    })
    stmt.finalize()
 
});

// Listar todas as tarefas
app.get('/tasks', (req, res) => {

    db.all("SELECT * FROM TAREFAS", [], (err,rows)=>{
        if (err){
            console.log('erro ao consultar tarefas', err.message)
            return res.status(500).json({error: 'Erro ao consultar tarefas'})
        }

    res.json(rows);
})
});

// Listar uma tarefa
app.get('/tasks/:id', (req, res) => {
    const {id} = req.params

    db.all("SELECT * FROM TAREFAS where id = (?)", [id], (err,rows)=>{
        if (err){
            console.log('erro ao consultar tarefas', err.message)
            return res.status(500).json({error: 'Erro ao consultar tarefas'})
        }

    res.json(rows);
})
});


// Atualizar uma tarefa existente
app.put('/tasks/:id', (req, res) => {
    
    const {id} = req.params;
    const {nome} = req.body;

   const stmt = db.prepare("update tarefas set nome  = (?) where id = (?)") 
   stmt.run(nome,id, function(err){
    if (err){
        console.log('erro ao atualizar')
        return res.status(500).json({error: 'erro ao atualizar'})
    }

    if(this.changes===0){
        return res.status(404).json({error:'tarefa nao encontrada'})
    }

    res.json({message:'tarefa atualizada com sucesso!', id,nome})
   })

   stmt.finalize()
    
    
});

// Remover uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const {id} =req.params;
    console.log(id)
    const stmt = db.prepare("delete from tarefas where id = (?)")
    stmt.run(id, function(err){
        if (err){
            console.log('erro ao deletar')
            return res.status(500).json({error: 'erro ao deletar'})
        }
    
        if(this.changes===0){
            return res.status(404).json({error:'tarefa nao encontrada'})
        }

        res.json({message:'tarefa deletada com sucesso!', id})
    })
});



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});