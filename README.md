# 🎴 Scrum Poker - Planning Poker Online

Aplicação de Planning Poker para equipes ágeis, com design retro Windows 98 e sincronização em tempo real.

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **React Router** (navegação)
- **WebSocket** (comunicação em tempo real)

### Backend
- **Go** (servidor WebSocket)
- Veja `BACKEND.md` para documentação completa do backend

## 📋 Funcionalidades

- ✅ Salas de votação em tempo real
- ✅ Múltiplos jogadores na mesma sala
- ✅ Sincronização automática de votos
- ✅ Sistema de roles (Frontend, Backend, Fullstack, Designer, Product, QA)
- ✅ Revelar/resetar votos
- ✅ Notificações de eventos (entrada/saída de jogadores)
- ✅ Indicador visual quando todos votaram
- ✅ Design retro Windows 98

## 🏗️ Arquitetura

A aplicação usa uma **arquitetura centralizada** onde o servidor Go gerencia todo o estado das salas e faz broadcast das mensagens para os clientes conectados.

### Fluxo:
```
Cliente A → Servidor → Broadcast para todos na sala
Cliente B → Servidor → Broadcast para todos na sala
Cliente C → Servidor → Broadcast para todos na sala
```

Veja `FRONTEND_CHANGES.md` para detalhes sobre a arquitetura e mudanças implementadas.

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ e npm/pnpm
- Go 1.21+ (para o backend)

### Frontend

```bash
# Instalar dependências
npm install
# ou
pnpm install

# Executar em desenvolvimento
npm run dev
# ou
pnpm dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview
```

### Backend

```bash
# Em outro terminal, no diretório do backend
cd backend
go run main.go
```

O backend estará disponível em:
- HTTP: `http://localhost:8000`
- WebSocket: `ws://localhost:8000/api/peerjs`

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` ou `.env.local` na raiz do projeto:

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Para produção, ajuste as URLs conforme seu deploy.

## 📖 Como Usar

1. **Inicie o backend** (veja instruções acima)
2. **Inicie o frontend** com `npm run dev`
3. Acesse `http://localhost:5173`
4. **Crie uma nova sala** ou **entre em uma sala existente**
5. Compartilhe o código da sala com sua equipe
6. Todos selecionam suas estimativas
7. Clique em **Revelar Estimativas** para ver os votos de todos
8. Clique em **Nova Rodada** para resetar e votar novamente

## 📚 Documentação

- `BACKEND.md` - Documentação completa do backend (endpoints, mensagens WebSocket, estrutura de dados)
- `FRONTEND_CHANGES.md` - Detalhes sobre a arquitetura do frontend e mudanças implementadas

## 🎮 Valores de Votação

A aplicação usa a sequência de Fibonacci modificada:
- **Números**: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
- **Especiais**: 
  - `?` - Não tenho certeza
  - `☕` - Preciso de uma pausa

## 🐛 Debug

O frontend possui logs detalhados no console do navegador:
- `[WS]` - Logs do WebSocket (conexão, mensagens)
- `[POKER]` - Logs da lógica do poker (votos, sala, estado)

Abra o Console do DevTools (F12) para ver os logs.

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos estarão em `dist/`. Você pode servir com qualquer servidor estático (Nginx, Apache, Vercel, Netlify, etc.)

### Configuração do Servidor de Produção

Certifique-se de:
1. Configurar as variáveis `VITE_API_URL` e `VITE_WS_URL` para apontar para seu backend
2. Servir o `index.html` para todas as rotas (SPA routing)
3. Configurar CORS no backend para permitir seu domínio frontend

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 📄 Licença

MIT
