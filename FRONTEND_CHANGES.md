# Frontend Adaptado para Backend Centralizado

## 📝 Resumo das Mudanças

O frontend foi completamente refatorado para trabalhar com o backend centralizado descrito no BACKEND.md. A arquitetura anterior era **P2P (peer-to-peer)**, onde os clientes se comunicavam diretamente entre si. A nova arquitetura é **centralizada**, onde o servidor gerencia todo o estado da sala e faz broadcast das mensagens.

## 🔄 Principais Mudanças

### 1. **Tipos (`src/types/poker.ts`)**

#### Removido:
- `PokerCard` (substituído por valores numéricos)
- `PokerMessage` (P2P)
- `SignalingMessage` (P2P específico)
- `Map<string, Player>` (substituído por array)

#### Adicionado:
- `WSMessage`: Estrutura base de mensagens WebSocket conforme backend
- `JoinRoomPayload`: Payload para entrar na sala
- `VotePayload`: Payload para votar
- `RoomStatePayload`: Estado completo da sala (recebido do servidor)
- `PlayerJoinedPayload`: Notificação de jogador entrando
- `PlayerLeftPayload`: Notificação de jogador saindo
- `VoteReceivedPayload`: Notificação de voto recebido
- `VotesRevealedPayload`: Notificação de votos revelados
- `NewTaskPayload`: Payload para definir nova tarefa

#### Estrutura do Player:
```typescript
interface Player {
  id: string
  name: string
  role?: PlayerRole
  vote?: number | null        // Voto do jogador (null = não votou)
  hasVoted?: boolean          // Flag indicando se votou
}
```

### 2. **SignalingClient (`src/services/signaling.ts`)**

#### Mudanças:
- Removido método `sendPokerMessage()` (não é mais necessário routing P2P)
- Simplificado para `sendMessage(message: WSMessage)` que envia diretamente para o servidor
- Servidor automaticamente adiciona o `src` (peer ID) nas mensagens
- Todas as mensagens são tratadas pelo servidor, que faz broadcast para a sala
- Melhor logging com prefixo `[WS]`
- **Prevenção de conexões duplicadas**: Verifica se já existe conexão antes de criar nova
- **Cleanup adequado**: Fecha conexão corretamente com código 1000 e limpa handlers

#### Antes (P2P):
```typescript
sendPokerMessage(dst: string | null, pokerMessage: PokerMessage)
```

#### Depois (Centralizado):
```typescript
sendMessage(message: WSMessage)
```

### 3. **usePokerSession Hook (`src/hooks/usePokerSession.ts`)**

#### Completamente reescrito:
- **Removido**: Sistema de heartbeat, discovery, sync_state (gerenciado pelo servidor)
- **Removido**: Gerenciamento de peers conectados (gerenciado pelo servidor)
- **Removido**: Broadcast manual para outros peers
- **Adicionado**: Tratamento de mensagens do servidor (ROOM_STATE, PLAYER_JOINED, etc.)
- **Melhorado**: Prevenção de múltiplas conexões com verificação antes de conectar
- **Melhorado**: Logs detalhados para debugging

#### Fluxo Anterior (P2P):
```
Cliente A → Envia para Cliente B
Cliente A → Envia para Cliente C
Cliente A → Mantém lista de peers
Cliente A → Envia heartbeat para todos
```

#### Fluxo Atual (Centralizado):
```
Cliente A → Envia para Servidor → Servidor faz broadcast para todos na sala
Servidor → Gerencia estado da sala
Servidor → Notifica eventos (join, leave, vote, etc.)
```

#### Mensagens Tratadas:
- `OPEN`: Conexão estabelecida
- `ROOM_STATE`: Servidor envia estado completo da sala
- `PLAYER_JOINED`: Alguém entrou na sala
- `PLAYER_LEFT`: Alguém saiu da sala
- `VOTE_RECEIVED`: Alguém votou
- `VOTES_REVEALED`: Votos foram revelados
- `VOTES_RESET`: Votos foram resetados
- `NEW_TASK`: Nova tarefa foi definida

#### Métodos Exportados:
```typescript
{
  vote,              // Votar em uma carta
  revealVotes,       // Revelar todos os votos
  resetVotes,        // Resetar votação (nova rodada)
  clearVote,         // Limpar seu voto
  setTask,           // Definir tarefa atual
  pokerCards,        // Array de cartas disponíveis
  setNotificationHandler  // Handler para notificações
}
```

### 4. **Componente Poker (`src/pages/Poker.tsx`)**

#### Mudanças de Estado:
- `selectedCard` → `myVote` (mais claro)
- `isRevealed` → `votesRevealed` (consistente com backend)
- `players: Map<string, Player>` → `players: Player[]` (array simples)
- Adicionado: `currentTask` (tarefa atual da sala)

#### UI Melhorada:
- Mostra indicador quando todos votaram
- Exibe tarefa atual (se definida)
- Melhor organização visual
- Status de voto mais claro (✓ para votou, ⏳ para aguardando)

### 5. **main.tsx - StrictMode Removido**

#### Importante:
O **React StrictMode foi removido** para evitar múltiplas conexões WebSocket durante desenvolvimento. O StrictMode monta componentes duas vezes em desenvolvimento, causando conexões duplicadas.

#### Antes:
```typescript
import { StrictMode } from 'react'
// ...
<StrictMode>
  <App />
</StrictMode>
```

#### Depois:
```typescript
createRoot(document.getElementById('root')!).render(
  <App />
)
```

## 🔌 Fluxo de Conexão

### 1. Cliente se conecta:
```typescript
// 1. Obtém peer ID do servidor
GET /api/ws/id → retorna UUID

// 2. Conecta WebSocket
WS /api/peerjs?id={peerId}

// 3. Recebe mensagem OPEN do servidor
{ type: "OPEN" }

// 4. Entra na sala
→ { type: "JOIN_ROOM", payload: { roomId, name, role } }

// 5. Servidor envia estado da sala
← { type: "ROOM_STATE", payload: { roomId, players, currentTask, votesRevealed } }
```

### 2. Cliente vota:
```typescript
→ { type: "VOTE", payload: { roomId, vote: 5 } }

// Servidor faz broadcast para todos
← { type: "VOTE_RECEIVED", payload: { roomId, playerId, hasVoted: true } }
← { type: "ROOM_STATE", payload: { ... } }  // Estado atualizado
```

### 3. Revelar votos:
```typescript
→ { type: "REVEAL_VOTES", payload: { roomId } }

// Servidor faz broadcast
← { type: "VOTES_REVEALED", payload: { roomId, votes: {...} } }
← { type: "ROOM_STATE", payload: { ..., votesRevealed: true } }
```

### 4. Nova rodada:
```typescript
→ { type: "RESET_VOTES", payload: { roomId } }

// Servidor faz broadcast
← { type: "VOTES_RESET", payload: { roomId } }
← { type: "ROOM_STATE", payload: { ..., votesRevealed: false, players com votes null } }
```

## 🎯 Benefícios da Nova Arquitetura

### ✅ Vantagens:
1. **Sincronização Garantida**: Servidor é fonte única de verdade
2. **Menos Complexidade**: Sem gerenciamento manual de peers
3. **Mais Confiável**: Servidor gerencia conexões duplicadas e timeout
4. **Escalável**: Servidor pode gerenciar múltiplas salas simultaneamente
5. **Consistência**: Todos veem o mesmo estado sempre
6. **Logs Centralizados**: Servidor registra todos os eventos
7. **Sem Conexões Duplicadas**: Frontend previne múltiplas conexões com verificações adequadas

### ❌ Removido (não mais necessário):
- Sistema de heartbeat entre peers
- Discovery de outros peers
- Sync state manual entre peers
- Gerenciamento de timeouts de peers
- Lista local de peers conectados
- Broadcast manual para múltiplos destinatários
- React StrictMode (causava conexões duplicadas)

## 🛡️ Prevenção de Conexões Duplicadas

### Frontend:
1. **StrictMode desabilitado**: Evita montagem dupla de componentes
2. **Verificação antes de conectar**: Hook verifica se já existe conexão ativa
3. **Cleanup adequado**: useEffect retorna função que fecha conexão corretamente
4. **Logs detalhados**: Permite identificar problemas facilmente

### Backend:
1. **Limite de conexões localhost**: Máximo de 4 conexões simultâneas de localhost
2. **Detecção automática**: Identifica múltiplas conexões do mesmo IP
3. **Substituição de conexões**: Fecha conexões antigas quando nova chega com mesmo peer ID
4. **Logs de duplicatas**: Registra quando conexões duplicadas são fechadas

## 🚀 Como Usar

### Desenvolvimento:
```bash
# Terminal 1: Backend (Go)
cd backend
go run main.go

# Terminal 2: Frontend (React + Vite)
npm install
npm run dev
```

### URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Backend WS: ws://localhost:8000/api/peerjs

## 📦 Variáveis de Ambiente

Crie um arquivo `.env` ou `.env.local`:

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

Para produção, ajuste as URLs conforme seu deploy.

## 🔍 Debug

O frontend possui logs detalhados com prefixos:
- `[WS]` - WebSocket (conexão, mensagens, reconexão)
- `[POKER]` - Lógica do poker (votos, sala, estado)

Logs importantes:
```
[WS] WebSocket já está conectado, ignorando reconexão
[WS] Conectado com ID: {peerId}
[WS] Desconectando WebSocket...
[POKER] WebSocket já conectado, ignorando nova conexão
[POKER] Inicializando nova conexão...
[POKER] Conectado com Peer ID: {peerId}
[POKER] Entrando na sala: {...}
[POKER] Limpando componente, desconectando WebSocket...
```

Para ver os logs, abra o Console do navegador (F12).

## 🔧 Troubleshooting

### Problema: Múltiplas conexões sendo criadas

**Sintomas**:
- Console mostra múltiplas mensagens "[POKER] Inicializando nova conexão..."
- Servidor mostra mais conexões do que navegadores abertos
- Comportamento instável na sala

**Causas**:
- ✅ **Resolvido**: StrictMode desabilitado
- ✅ **Resolvido**: Verificações de conexão existente implementadas
- ✅ **Resolvido**: Cleanup adequado no useEffect

**Verificar**:
1. Certifique-se de que `src/main.tsx` **NÃO** tem `<StrictMode>`
2. Verifique os logs do console - deve aparecer "WebSocket já conectado, ignorando nova conexão" se tentar conectar novamente
3. Backend deve mostrar apenas 1 conexão por navegador

### Problema: "WebSocket não está conectado"

**Verificar**:
1. Backend está rodando? (`go run main.go`)
2. URL correta? (verifique variáveis de ambiente)
3. Console mostra erro de conexão?
4. Firewall bloqueando porta 8000?

### Problema: Jogadores não aparecem na sala

**Verificar**:
1. Mensagem `JOIN_ROOM` está sendo enviada? (verifique console)
2. Todos usam o mesmo `roomId`?
3. Servidor recebeu a mensagem? (verifique logs do backend)
4. Mensagem `ROOM_STATE` foi recebida? (verifique console)

### Problema: Votos não sincronizam

**Verificar**:
1. Todos estão na mesma sala?
2. Mensagem `VOTE` tem o `roomId` correto?
3. Servidor enviou `VOTE_RECEIVED` ou `ROOM_STATE`?
4. Console mostra erro ao enviar mensagem?

## ✨ Resultado

O frontend está **100% compatível** com o backend descrito no BACKEND.md!

### Checklist de Implementação:
- ✅ Tipos atualizados para estrutura do backend
- ✅ SignalingClient simplificado para comunicação centralizada
- ✅ usePokerSession reescrito sem P2P
- ✅ UI atualizada com estado do servidor
- ✅ StrictMode removido
- ✅ Prevenção de conexões duplicadas
- ✅ Cleanup adequado de conexões
- ✅ Logs detalhados para debugging
- ✅ Tratamento de todas as mensagens do backend
- ✅ Sincronização em tempo real funcionando

## 📚 Referências

- `BACKEND.md` - Documentação completa do backend
- `README.md` - Instruções de uso e instalação
