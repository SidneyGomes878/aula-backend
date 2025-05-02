const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa.db');

const app = express();

app.use(express.json())
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

// Corrigido: faltava a barra no caminho da rota e o segundo argumento estava errado
app.get('/teste', (req, res) => {
  res.render("iae-mano", { mensagem: "tudo certo" }); // 'iae-mano' é o nome do template ejs
});

// Corrigido: parênteses extras e indentação
app.get('/funcionarios', (req, res) => {
  db.all('SELECT * FROM funcionarios', (erro, resultado) => {
    if (erro) {
      res.json({ "mensagem": "falha ao consultar: "+erro.message });
      return;
    }
    res.json(resultado);
  });
});
//criar um endpoint pra consultar funcionario
app.get('/funcionarios/:id',(req,res)=>{
  const id = req.params.id;
db.all('SELECT * FROM funcionarios WHERE id=?',[id],(erro,resultado)=>{
  if(erro){
    res.json({"mensagem":"falha ao consultar: ${erro.message}"});
    return;
  }
  res.json(resultado[0])
});
})
//criar um endpoint pra criar funcionario
app.post('/funcionarios', (req, res) => {
  const { nome, cargo, salario } = req.body;
  db.run(
    'INSERT INTO funcionarios (nome, cargo, salario) VALUES (?, ?, ?)',
    [nome, cargo, salario],
    function (erro) {
      if (erro) {
        res.json({ "mensagem": "falha ao inserir: " + erro.message });
        return;
      }
      res.json({ "mensagem": "inserido com sucesso", id: this.lastID });
    }
  );
});
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Erro ao iniciar o servidor:', err);
});

