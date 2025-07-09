/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Envia uma pergunta ao assistente virtual gamer do Wargorithm.
 *     description: |
 *       Endpoint para interagir com o assistente virtual do jogo Wargorithm. O assistente responde apenas perguntas relacionadas ao jogo, utilizando um tom divertido, gamer e simpático, sempre em português brasileiro.
 *     tags:
 *       - Chatbot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Pergunta a ser enviada ao assistente virtual.
 *             required:
 *               - question
 *     responses:
 *       200:
 *         description: Resposta do assistente virtual.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageReceived:
 *                   type: string
 *                   description: Confirmação da mensagem recebida.
 *                 response:
 *                   type: string
 *                   description: Resposta do assistente virtual.
 *       400:
 *         description: Nenhuma pergunta foi enviada no corpo da requisição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor ou API key não configurada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
import { Router, Request, Response } from "express";
import { verificarToken } from "../middlewares/auth";
import axios from "axios";

const router = Router();

router.post("/", verificarToken, async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    res
      .status(400)
      .json({ error: "Nenhuma pergunta foi enviada no corpo da requisição." });
    return;
  }
  const apiKey = process.env.apiKey;
  if (!apiKey) {
    res.status(500).json({ error: "API key não configurada no ambiente." });
    return;
  }
  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
  //https://console.groq.com/keys PRA CONSEGUIR A API KEY
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente virtual gamer e engraçado do jogo Wargorithm. Seu foco é TOTALMENTE voltado para esse jogo. Rejeite educadamente qualquer pergunta que não tenha a ver com o Wargorithm, dizendo que só pode responder sobre isso.Sempre responda em português brasileiro. Use um tom divertido, gamer e simpático, mas sempre com explicações claras e diretas.Você só pode usar as informações fornecidas na mensagem do 'assistant' abaixo.",
          },
          {
            role: "assistant",
            content:
              "Sobre o Wargorithm: Wargorithm é um jogo insano de duelo entre programadores, onde lógica e estratégia são suas armas principais. Pensa num x1 de código com adrenalina e estilo! Criador: Desenvolvido por Ryan Alves Mazzeu, estudante de Engenharia da Computação na UNIFEI (e claramente boss de programação). **Plataforma Web**: Funciona 100% online. Crie sua conta, faça login e caia de cabeça na guerra digital! Home: Ao logar, você cai na Home (tipo um hub central) onde pode acessar tudo — inclusive este humilde assistente gamer. Perfil: Personalize sua conta com foto, nome e senha. Deixe seu avatar com estilo de dev lendário. Comunidade: Adicione amigos, envie mensagens e troque ideias com outros jogadores. Código também é social, bebê!Ranking: Veja quem são os top players que estão dominando na pancadaria lógica. Bora subir esse ranking!\n\n⚔️ **Gameplay**:\n- Duelos de programação em tempo real.\n- Teste suas skills com desafios de lógica e estratégia.\n- Ideal pra quem curte pensar rápido e vencer bonito.\n\n🎨 **Visual**:\n- Estilo cartoon 3D estiloso, com efeitos vibrantes.\n- O jogo alterna entre os visuais 'VS' e o logo **Wargorithm** no centro da batalha — puro suco de adrenalina visual.\n\n📦 **Extras técnicos**:\n- Frontend usa Next.js (App Router).\n- Backend com autenticação, API de usuários, ranking e chat entre players.\n\n🚀 Pronto pra quebrar o teclado? Então manda ver! Pergunta aí algo sobre o Wargorithm! Informações sobre a criação do jogo: o backend foi feito em express e o front em NextJS porém vc só fala sobre isso se a pessoa perguntar diretamente!",
          },
          {
            role: "user",
            content: question,
          },
        ],
        temperature: 0.9,
        top_p: 1,
        max_tokens: 1024,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botResponse =
      response.data.choices?.[0]?.message?.content ||
      "Sem resposta do assistente.";

    res.json({
      messageReceived: `Mensagem recebida: "${question}"`,
      response: botResponse,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao se comunicar com o assistente." });
    return;
  }
  res.json({
    messageReceived: `Mensagem recebida: "${question}"`,
    response: `"Oi! ${question}"`,
  });
});

export default router;
