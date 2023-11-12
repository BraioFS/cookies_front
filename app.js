const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(
  session({
    secret: "minhachave",
    resave: false,
    saveUninitialized: true,
  })
);

const produtos = [
  { id: 1, nome: "Arroz", preco: 25 },
  {
    id: 2,
    nome: "Feijão",
    preco: 15,
  },
  {
    id: 3,
    nome: "Bife",
    preco: 40,
  },
];

//Rota para exibir produtos
app.get("/", (req, res) => {
  res.cookie("usuario_logado", {
    nome: "Jão",
    email: "bryan@example.com",
    url: "https://a.imagem.app/oqijzN.png",
  });
  res.send(`
  <div style="font-family: 'Cera Round Pro', sans-serif; text-transform: uppercase;">
  <h1 style="text-align: center; margin-top: 80px;">Lista de produtos</h1>
  <ul style="text-align: center; margin-left: 530px; margin-top:50px;">
  ${produtos
    .map(
      (produto) =>
        `<li style="list-style-type: none; text-align: left; margin-top: 20px; text-transform: uppercase;">${produto.nome} - ${produto.preco} <a href="/adicionar/${produto.id}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-align: center; text-decoration: none; border: none; border-radius: 5px;">Adicionar</a></li>`
    )
    .join("")}
</ul>
<div style="display: flex; justify-content: center;  margin-top:50px;">
<a href="/carrinho" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-align: center; text-decoration: none; border: none; border-radius: 5px; margin-right: 10px;">Ver carrinho</a>
<a href="/perfil" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-align: center; text-decoration: none; border: none; border-radius: 5px;"> Seu perfil </a>
</div>
</div>
  `);
});

app.get("/adicionar/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if (produto) {
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }
    req.session.carrinho.push(produto);
  }

  res.redirect("/");
});

app.get("/carrinho", (req, res) => {
  const carrinho = req.session.carrinho || [];
  const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

  res.send(`
  <h1>Carrinho de compras</h1>
  <ul>
  ${carrinho
    .map((produto) => `<li>${produto.nome} - ${produto.preco}<li>`)
    .join("")}
  </ul>

  <p>Total: ${total}</p>
  <a href="/">Continuar comprando<a/>
  `);
});

app.get("/perfil", (req, res) => {
  const usuarioLogado = req.cookies.usuario_logado;
  res.send(`
  <h1>Seu perfil</h1>
  <ul>
  <img src=${usuarioLogado.url} alt="foto" border="0" />
  <li>Nome: ${usuarioLogado.nome}</li>
  <li>Email: ${usuarioLogado.email}</li>
  </ul>
  
  <a href="/">Voltar as compras<a/>
  `);
});

app.listen(port, () => {
  console.log(`Rodando em: http://localhost:${port}`);
});
