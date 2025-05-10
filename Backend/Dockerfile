# Usa imagem oficial do Node.js
FROM node:20

# Define diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila os arquivos TypeScript
RUN npx prisma generate

RUN npx tsc
# Expõe a porta que seu servidor usa
EXPOSE 3000

# Comando que será executado ao iniciar o container
CMD ["npm", "run", "start"]

