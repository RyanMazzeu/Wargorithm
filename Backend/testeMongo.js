require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

// Pegando a URL do MongoDB
const mongoURI = process.env.MONGO_URI;
console.log("🔍 Conectando ao MongoDB...");

// Função para testar a conexão e inserir um dado
async function testarMongo() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB!");

    // Criando um modelo de teste
    const TesteSchema = new mongoose.Schema({ nome: String, senha: String });
    const TesteModel = mongoose.model("Teste", TesteSchema);

    // Inserindo um documento de teste
    const novoDado = new TesteModel({
      nome: "Teste de conexão 2",
      senha: "123456",
    });
    await novoDado.save();
    console.log("✅ Dado inserido com sucesso!");

    // Fechando a conexão
    await mongoose.connection.close();
    console.log("🔌 Conexão fechada.");
  } catch (erro) {
    console.error("❌ Erro ao conectar ou inserir dado:", erro);
  }
}

// Executa o teste
testarMongo();
