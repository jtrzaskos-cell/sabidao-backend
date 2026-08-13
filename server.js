require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Banco de dados conectado!'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');


app.use('/api', chatRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: 'Backend do Sabidão rodando! 🦉',
    escola: 'Colégio Helena Wysocki'
  });
});

app.listen(PORT, () => {
  console.log(`Sabidão rodando em http://localhost:${PORT}`);
});