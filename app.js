const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/relatorioController');
const prodController = require('./controllers/prodController');
const app = express(); //cria uma instancia do aplicativo express

//configura o ejs como mecanismo de visualização 
app.set('view engine', 'ejs');

//middleware para parsing do body
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', userController.getAllUsers);
app.get('/produtos', prodController.getAllProds);

app.get('/produto/pdf', prodController.generatePDF);
app.get('/relatorio/pdf', userController.generatePDF);

//iniciar servidor 
app.listen(2000, () => { 
    console.log('Servidor rodando na porta 2000');
});

