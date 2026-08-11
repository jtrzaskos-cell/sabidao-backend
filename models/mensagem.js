const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
  aluno: {
    type: String,
    default: 'Anônimo'
  },
  pergunta: {
    type: String,
    required: true
  },
  resposta: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mensagem', mensagemSchema);
