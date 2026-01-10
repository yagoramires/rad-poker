# Scrum Poker Backend - Documentação

## 📋 Estrutura do Backend

### ✅ Funcionalidades Implementadas:

O backend agora é um **servidor WebSocket completo para Scrum Poker** que:

1. ✅ **Sistema de Salas (Rooms)**: Múltiplos jogadores podem entrar na mesma sala
2. ✅ **Broadcast de Mensagens**: Envia mensagens para todos os jogadores de uma sala
3. ✅ **Gerenciamento de Estado Compartilhado**: Sincroniza votos, tarefas e status entre jogadores
4. ✅ **Sincronização em Tempo Real**: Todos os jogadores veem atualizações instantaneamente
5. ✅ **Estrutura de Player**: Cada jogador tem `id`, `name`, `role` e `vote` (voto)
6. ✅ **Gerenciamento Inteligente de Conexões**: Detecta e fecha automaticamente conexões duplicadas do mesmo IP
7. ✅ **Limpeza Automática**: Remove conexões inativas e salas vazias automaticamente
8. ✅ **Logs Detalhados**: Sistema de logging completo para depuração e monitoramento

### 🎮 Estrutura de Dados do Player:

Cada jogador possui:
- **id**: ID único do cliente (obtido via `/api/ws/id`)
- **name**: Nome do jogador
- **role**: Papel/função do jogador (ex: "Scrum Master", "Developer", etc.)
- **vote**: Valor do voto selecionado (null quando não votou, ou número quando votou)

### 📨 Tipos de Mensagens Implementados:

- ✅ `JOIN_ROOM`: Entrar em uma sala
- ✅ `VOTE`: Enviar voto
- ✅ `REVEAL_VOTES`: Revelar todos os votos
- ✅ `NEW_TASK`: Adicionar nova tarefa
- ✅ `RESET_VOTES`: Resetar votação
- ✅ `ROOM_STATE`: Estado atual da sala (sincronização automática)
- ✅ `PLAYER_JOINED`: Notificação quando um jogador entra
- ✅ `PLAYER_LEFT`: Notificação quando um jogador sai
- ✅ `VOTE_RECEIVED`: Notificação quando um jogador vota
- ✅ `VOTES_REVEALED`: Notificação quando os votos são revelados
- ✅ `VOTES_RESET`: Notificação quando os votos são resetados

## 📡 Estrutura de Dados Suportada pelo Backend

### Endpoints Disponíveis

#### 1. **GET /api/ws/id**
Gera um ID único para o cliente.

**Resposta:**
```
string (UUID)
```

**Exemplo:**
```bash
curl http://localhost:8000/api/ws/id
# Retorna: "550e8400-e29b-41d4-a716-446655440000"
```

#### 2. **WebSocket: /api/peerjs?id={peerId}**
Conecta via WebSocket. O `peerId` deve ser obtido do endpoint `/api/ws/id`.

**Query Parameters:**
- `id`: ID único do cliente (obrigatório)

**Mensagem de Abertura:**
```json
{
  "type": "OPEN"
}
```

### Estrutura de Mensagens WebSocket

#### Formato Base:
```typescript
interface WSMessage {
  type: string;           // Tipo da mensagem
  dst?: string;           // ID do destinatário (opcional)
  src?: string;           // ID do remetente (opcional, preenchido automaticamente)
  payload?: any;          // Dados da mensagem (JSON)
}
```

#### Tipos de Mensagens Suportados:

##### Mensagens de Conexão:

1. **OPEN** - Conexão estabelecida
```json
{
  "type": "OPEN"
}
```

##### Mensagens WebRTC (compatibilidade):

2. **CANDIDATE** - WebRTC candidate (relay para dst)
```json
{
  "type": "CANDIDATE",
  "dst": "peer-id-destino",
  "src": "peer-id-origem",
  "payload": { ... }
}
```

3. **ANSWER** - WebRTC answer (relay para dst)
```json
{
  "type": "ANSWER",
  "dst": "peer-id-destino",
  "src": "peer-id-origem",
  "payload": { ... }
}
```

4. **OFFER** - WebRTC offer (relay para dst)
```json
{
  "type": "OFFER",
  "dst": "peer-id-destino",
  "src": "peer-id-origem",
  "payload": { ... }
}
```

5. **EXPIRE** - Destinatário offline
```json
{
  "type": "EXPIRE",
  "src": "peer-id-origem",
  "dst": "peer-id-destino"
}
```

##### Mensagens de Scrum Poker:

6. **JOIN_ROOM** - Entrar em uma sala (cliente → servidor)
```json
{
  "type": "JOIN_ROOM",
  "payload": {
    "roomId": "sala-123",
    "name": "João",
    "role": "Developer"
  }
}
```

7. **VOTE** - Enviar voto (cliente → servidor)
```json
{
  "type": "VOTE",
  "payload": {
    "roomId": "sala-123",
    "vote": 5
  }
}
```

8. **REVEAL_VOTES** - Revelar todos os votos (cliente → servidor)
```json
{
  "type": "REVEAL_VOTES",
  "payload": {
    "roomId": "sala-123"
  }
}
```

9. **RESET_VOTES** - Resetar votação (cliente → servidor)
```json
{
  "type": "RESET_VOTES",
  "payload": {
    "roomId": "sala-123"
  }
}
```

10. **NEW_TASK** - Definir nova tarefa (cliente → servidor)
```json
{
  "type": "NEW_TASK",
  "payload": {
    "roomId": "sala-123",
    "task": "Implementar login"
  }
}
```

##### Mensagens de Broadcast (servidor → clientes):

11. **ROOM_STATE** - Estado atual da sala (sincronização automática)
```json
{
  "type": "ROOM_STATE",
  "payload": {
    "roomId": "sala-123",
    "players": [
      {
        "id": "player-1",
        "name": "João",
        "role": "Developer",
        "vote": 5,
        "hasVoted": true
      },
      {
        "id": "player-2",
        "name": "Maria",
        "role": "Scrum Master",
        "hasVoted": false
      }
    ],
    "currentTask": "Implementar login",
    "votesRevealed": false
  }
}
```

12. **PLAYER_JOINED** - Jogador entrou na sala
```json
{
  "type": "PLAYER_JOINED",
  "payload": {
    "roomId": "sala-123",
    "player": {
      "id": "player-3",
      "name": "Pedro",
      "role": "Developer"
    }
  }
}
```

13. **PLAYER_LEFT** - Jogador saiu da sala
```json
{
  "type": "PLAYER_LEFT",
  "payload": {
    "roomId": "sala-123",
    "playerId": "player-1"
  }
}
```

14. **VOTE_RECEIVED** - Notificação de voto recebido
```json
{
  "type": "VOTE_RECEIVED",
  "payload": {
    "roomId": "sala-123",
    "playerId": "player-1",
    "hasVoted": true
  }
}
```

15. **VOTES_REVEALED** - Votos foram revelados
```json
{
  "type": "VOTES_REVEALED",
  "payload": {
    "roomId": "sala-123",
    "votes": {
      "player-1": 5,
      "player-2": 8,
      "player-3": 3
    }
  }
}
```

16. **VOTES_RESET** - Votos foram resetados
```json
{
  "type": "VOTES_RESET",
  "payload": {
    "roomId": "sala-123"
  }
}
```

## 🚀 Como Usar com React + Vite

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração do WebSocket

Crie um hook customizado para gerenciar a conexão:

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

interface WSMessage {
  type: string;
  dst?: string;
  src?: string;
  payload?: any;
}

export function useWebSocket(url: string, peerId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!peerId) return;

    const ws = new WebSocket(`${url}?id=${peerId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      setLastMessage(message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url, peerId]);

  const sendMessage = (message: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, lastMessage, sendMessage };
}
```

### 3. Obter ID do Cliente

```typescript
// utils/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getPeerId(): Promise<string> {
  const response = await fetch(`${API_URL}/api/ws/id`);
  if (!response.ok) {
    throw new Error('Falha ao obter ID');
  }
  return response.text();
}
```

### 4. Exemplo de Componente de Sala

```typescript
// components/ScrumPokerRoom.tsx
import { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { getPeerId } from '../utils/api';

interface Player {
  id: string;
  name: string;
  role: string;
  vote?: number | null;
  hasVoted?: boolean;
}

interface RoomState {
  roomId: string;
  players: Player[];
  currentTask: string;
  votesRevealed: boolean;
}

export function ScrumPokerRoom({ 
  roomId, 
  playerName, 
  playerRole 
}: { 
  roomId: string;
  playerName: string;
  playerRole: string;
}) {
  const [peerId, setPeerId] = useState<string>('');
  const [roomState, setRoomState] = useState<RoomState>({
    roomId,
    players: [],
    currentTask: '',
    votesRevealed: false,
  });

  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    'ws://localhost:8000/api/peerjs',
    peerId
  );

  useEffect(() => {
    getPeerId().then((id) => {
      setPeerId(id);
      if (id && isConnected) {
        sendMessage({
          type: 'JOIN_ROOM',
          payload: {
            roomId,
            name: playerName,
            role: playerRole,
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    if (peerId && isConnected) {
      sendMessage({
        type: 'JOIN_ROOM',
        payload: {
          roomId,
          name: playerName,
          role: playerRole,
        },
      });
    }
  }, [peerId, isConnected]);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'ROOM_STATE':
          setRoomState(lastMessage.payload);
          break;
        case 'VOTES_REVEALED':
          setRoomState((prev) => ({ ...prev, votesRevealed: true }));
          break;
        case 'VOTES_RESET':
          setRoomState((prev) => ({ ...prev, votesRevealed: false }));
          break;
        case 'NEW_TASK':
          setRoomState((prev) => ({
            ...prev,
            currentTask: lastMessage.payload.task,
            votesRevealed: false,
          }));
          break;
      }
    }
  }, [lastMessage]);

  const handleVote = (vote: number) => {
    sendMessage({
      type: 'VOTE',
      payload: {
        roomId,
        vote,
      },
    });
  };

  const handleRevealVotes = () => {
    sendMessage({
      type: 'REVEAL_VOTES',
      payload: { roomId },
    });
  };

  const handleResetVotes = () => {
    sendMessage({
      type: 'RESET_VOTES',
      payload: { roomId },
    });
  };

  const handleNewTask = (task: string) => {
    sendMessage({
      type: 'NEW_TASK',
      payload: {
        roomId,
        task,
      },
    });
  };

  if (!isConnected) {
    return <div>Conectando...</div>;
  }

  return (
    <div>
      <h2>Sala: {roomId}</h2>
      <div>
        <h3>Tarefa Atual:</h3>
        <p>{roomState.currentTask || 'Nenhuma tarefa definida'}</p>
      </div>
      <div>
        <h3>Jogadores ({roomState.players.length}):</h3>
        {roomState.players.map((player) => (
          <div key={player.id}>
            <strong>{player.name}</strong> ({player.role}):{' '}
            {roomState.votesRevealed
              ? player.vote ?? 'Não votou'
              : player.hasVoted
              ? '✓ Votou'
              : '⏳ Aguardando'}
          </div>
        ))}
      </div>
      <div>
        <h3>Votar:</h3>
        <button onClick={() => handleVote(1)}>1</button>
        <button onClick={() => handleVote(2)}>2</button>
        <button onClick={() => handleVote(3)}>3</button>
        <button onClick={() => handleVote(5)}>5</button>
        <button onClick={() => handleVote(8)}>8</button>
        <button onClick={() => handleVote(13)}>13</button>
      </div>
      <div>
        <button onClick={handleRevealVotes}>Revelar Votos</button>
        <button onClick={handleResetVotes}>Resetar Votos</button>
      </div>
    </div>
  );
}
```

## 🔄 Estrutura de Dados Implementada no Backend

### Todas as mensagens abaixo já estão implementadas e funcionando:

#### 1. JOIN_ROOM
```json
{
  "type": "JOIN_ROOM",
  "payload": {
    "roomId": "sala-123",
    "playerName": "João"
  }
}
```

#### 2. VOTE
```json
{
  "type": "VOTE",
  "payload": {
    "roomId": "sala-123",
    "vote": 5
  }
}
```

#### 3. REVEAL_VOTES
```json
{
  "type": "REVEAL_VOTES",
  "payload": {
    "roomId": "sala-123"
  }
}
```

#### 4. ROOM_STATE (broadcast)
```json
{
  "type": "ROOM_STATE",
  "payload": {
    "roomId": "sala-123",
    "players": [
      {
        "id": "player-1",
        "name": "João",
        "vote": 5
      },
      {
        "id": "player-2",
        "name": "Maria",
        "vote": 8
      }
    ],
    "currentTask": "Implementar login",
    "votesRevealed": false
  }
}
```

#### 5. PLAYER_JOINED (broadcast)
```json
{
  "type": "PLAYER_JOINED",
  "payload": {
    "roomId": "sala-123",
    "player": {
      "id": "player-3",
      "name": "Pedro"
    }
  }
}
```

#### 6. VOTE_RECEIVED (broadcast)
```json
{
  "type": "VOTE_RECEIVED",
  "payload": {
    "roomId": "sala-123",
    "playerId": "player-1",
    "vote": 5
  }
}
```

#### 7. VOTES_REVEALED (broadcast)
```json
{
  "type": "VOTES_REVEALED",
  "payload": {
    "roomId": "sala-123",
    "votes": {
      "player-1": 5,
      "player-2": 8,
      "player-3": 3
    }
  }
}
```

#### 8. RESET_VOTES
```json
{
  "type": "RESET_VOTES",
  "payload": {
    "roomId": "sala-123"
  }
}
```

## ✅ Implementação Completa no Backend

Todas as funcionalidades abaixo já foram implementadas no `main.go`:

1. ✅ **Estrutura de Room e Player:**
   - `room`: Gerencia salas com jogadores e estado
   - `player`: Cada jogador tem `id`, `name`, `role` e `vote`
   - `roomState`: Estado da sala (tarefa atual, votos revelados)
   - `client`: Gerencia conexões WebSocket com rastreamento de endereço remoto

2. ✅ **Gerenciamento de salas:**
   - Criação automática de salas
   - Remoção automática quando vazias
   - Sincronização de estado entre jogadores
   - Limpeza automática de jogadores desconectados

3. ✅ **Handler WebSocket completo:**
   - Processa `JOIN_ROOM`, `VOTE`, `REVEAL_VOTES`, `RESET_VOTES`, `NEW_TASK`
   - Broadcast automático para todos os jogadores da sala
   - Sincronização em tempo real
   - Detecção e fechamento automático de conexões duplicadas

4. ✅ **Funções de broadcast:**
   - `broadcastToRoom`: Envia mensagens para todos na sala
   - `broadcastRoomState`: Sincroniza estado completo da sala
   - Notificações automáticas de eventos (join, leave, vote, etc.)

5. ✅ **Gerenciamento Inteligente de Conexões:**
   - **Detecção de duplicatas**: Identifica múltiplas conexões do mesmo IP
   - **Fechamento automático**: Fecha conexões duplicadas criadas nos últimos 5 segundos
   - **Substituição de conexões**: Substitui automaticamente conexões antigas quando uma nova chega com o mesmo peer ID
   - **Rastreamento de endereço remoto**: Cada conexão armazena seu endereço IP para detecção de duplicatas
   - **Limpeza de salas**: Remove automaticamente jogadores das salas quando suas conexões são fechadas

6. ✅ **Sistema de Logs:**
   - Logs detalhados de conexões e desconexões
   - Rastreamento de endereços remotos
   - Notificações quando conexões duplicadas são detectadas e fechadas
   - Logs de erros de WebSocket para depuração

## 🔌 Gerenciamento de Conexões

O backend implementa um sistema inteligente de gerenciamento de conexões WebSocket:

### Detecção de Conexões Duplicadas

- **Problema comum**: Frontends podem criar múltiplas conexões WebSocket, especialmente durante desenvolvimento (React StrictMode, hot reload, etc.)
- **Solução**: O backend detecta automaticamente quando múltiplas conexões vêm do mesmo endereço IP
- **Ação**: Conexões duplicadas criadas nos últimos 5 segundos são automaticamente fechadas
- **Logs**: O servidor registra quando conexões duplicadas são detectadas e fechadas

### Substituição de Conexões

- Se uma nova conexão chega com o mesmo `peer ID` de uma conexão existente, a conexão antiga é fechada automaticamente
- O jogador é removido da sala antes da nova conexão ser estabelecida
- Isso previne jogadores "fantasma" nas salas

### Limpeza Automática

- **Conexões inativas**: Conexões sem atividade por mais de 30 minutos são automaticamente removidas
- **Salas vazias**: Salas sem jogadores são automaticamente deletadas
- **Cleanup periódico**: Executado a cada 5 minutos

### Logs de Conexão

O servidor registra:
- `Peer connected: {id} from {remoteAddr} (Total: {count})` - Nova conexão estabelecida
- `Replacing existing connection for peer: {id} (same ID)` - Conexão substituída pelo mesmo ID
- `Closing recent duplicate connection from same IP: {ip} (peer: {id})` - Conexão duplicada fechada
- `Found X other connections from same IP: {ip}, closing recent ones` - Múltiplas conexões detectadas
- `Peer disconnected: {id} (Total: {count})` - Conexão fechada

## 📝 Variáveis de Ambiente

```bash
PORT=8000  # Porta do servidor (padrão: 8000)
```

### Configurações de Timeout (no código)

```go
aliveTimeout      = 120 * time.Second      // Timeout de leitura de headers
peerInactiveLimit = 30 * time.Minute       // Limite de inatividade antes de remover
peerCleanupEvery  = 5 * time.Minute        // Intervalo de limpeza automática
duplicateWindow   = 5 * time.Second        // Janela para detectar duplicatas
```

## 🔒 CORS e Segurança

O backend já está configurado com:
- ✅ CORS para origens permitidas
- ✅ Rate limiting (30 requisições/hora)
- ✅ Headers de segurança
- ✅ Cleanup de conexões inativas (30 minutos de inatividade)
- ✅ Detecção e prevenção de conexões duplicadas
- ✅ Limpeza automática de salas vazias

**Origens permitidas:**
- `http://localhost:5173` (Vite padrão)
- `http://localhost:5174` (Vite alternativo)
- `https://planin-front-842303020925.us-east1.run.app`

## 🐳 Docker

```bash
docker build -t scrum-poker-back .
docker run -p 8000:8000 scrum-poker-back
```

## 🔧 Troubleshooting

### Problema: Múltiplas conexões sendo criadas

**Sintoma**: O servidor mostra mais conexões do que o número de navegadores abertos.

**Causas comuns**:
- React StrictMode criando múltiplas conexões durante desenvolvimento
- Hot reload recriando conexões
- Múltiplas chamadas ao hook de WebSocket
- Componente sendo montado múltiplas vezes

**Solução**: O backend já resolve isso automaticamente:
- Detecta conexões duplicadas do mesmo IP
- Fecha automaticamente conexões criadas nos últimos 5 segundos
- Verifique os logs para ver mensagens como "Closing recent duplicate connection"

**Prevenção no Frontend**:
```typescript
// Certifique-se de que o useEffect tem dependências corretas
useEffect(() => {
  if (!peerId || isConnected) return;
  
  const ws = new WebSocket(`${url}?id=${peerId}`);
  // ... resto do código
  
  return () => {
    ws.close();
  };
}, [peerId]); // Apenas reconectar se peerId mudar
```

### Problema: Jogadores não aparecem na sala

**Verifique**:
1. Se a mensagem `JOIN_ROOM` está sendo enviada corretamente
2. Se o `roomId` é o mesmo para todos os jogadores
3. Se a conexão WebSocket está estabelecida (verifique o log "Peer connected")
4. Se há erros no console do navegador

### Problema: Votos não sincronizam

**Verifique**:
1. Se todos os jogadores estão na mesma sala
2. Se a mensagem `VOTE` está sendo enviada com o `roomId` correto
3. Se o servidor está recebendo as mensagens (verifique os logs)
4. Se o `ROOM_STATE` está sendo recebido no frontend

## ⚡ Próximos Passos

1. ✅ **Backend completo** - Todas as funcionalidades implementadas
2. **Criar o frontend React** usando os exemplos acima
3. **Testar com múltiplos jogadores** na mesma sala
4. **Personalizar** conforme suas necessidades (valores de votação, roles, etc.)

## 📚 Recursos Adicionais

- [Gorilla WebSocket Documentation](https://github.com/gorilla/websocket)
- [React WebSocket Hooks](https://github.com/robtaussig/react-use-websocket)
