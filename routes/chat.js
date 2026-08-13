const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Mensagem = require('../models/Mensagem');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/perguntar', async (req, res) => {
  try {
    const { pergunta, aluno } = req.body;

    if (!pergunta) {
      return res.status(400).json({ erro: 'Envie a pergunta' });
    }

    const systemPrompt = `Você é o Sabidão, uma IA amigável e paciente criada para ajudar os alunos do Colégio Helena Wysocki.
Responda de forma clara, didática e motivadora.
Use linguagem adequada para estudantes do ensino fundamental e médio.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: pergunta }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const resposta = completion.choices[0]?.message?.content || 'Desculpe, não consegui responder.';

    // Salvar no banco de dados
    await Mensagem.create({
      aluno: aluno || 'Anônimo',
      pergunta,
      resposta
    });

    res.json({
      sucesso: true,
      resposta,
      aluno: aluno || 'Anônimo'
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: 'Erro ao processar a pergunta',
      detalhes: erro.message
    });
  }
});

// Rota para ver o histórico
// Rota para ver o histórico (do usuário ou geral)
router.get('/historico', async (req, res) => {
  try {
    const { aluno } = req.query;

    let filtro = {};
    if (aluno) {
      filtro.aluno = aluno;
    }

    const mensagens = await Mensagem.find(filtro)
      .sort({ data: -1 })
      .limit(50);

    res.json(mensagens);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
});

module.exports= router;