# 🎴 Scrum Poker 98™

Planning Poker para equipes ágeis com estética Windows 98/XP retrô!

## ✨ Features

### 🎯 Core Features
- **Planning Poker em tempo real** usando WebRTC (PeerJS)
- **Salas virtuais** com códigos únicos para compartilhar
- **Roles personalizados** (Frontend, Backend, Fullstack, Designer, Product, QA, etc)
- **Votação Fibonacci** clássica (1, 2, 3, 5, 8, 13, 21, 34, ?, ☕)
- **Revelação sincronizada** de estimativas
- **Sistema de notificações** toast estilo Windows 98

### 🎨 Design Windows 98/XP
- **Estética retrô completa** com janelas, bordas 3D e fontes características
- **Barra de tarefas** funcional com botão Iniciar
- **Menu Iniciar** com opções e informações
- **Ícones de desktop** arrastáveis
- **Diálogos modais** estilo Windows
- **Animações retrô** (slide-in, bounce, shake, float)

### 🎮 Easter Eggs
- **Clippy Assistant** - O famoso ajudante do Office aparece aleatoriamente!
  - Clique nele para mudar as mensagens
  - Arraste pela tela
  - Mensagens divertidas sobre Scrum
- **Código Konami** - Tente descobrir no menu Iniciar! ↑↑↓↓←→←→BA
- **Clique secreto no título** - Clique 7 vezes no título da janela Poker
- **Clique secreto no logo** - Clique 10 vezes no logo da Home
- **Mensagens escondidas** em vários lugares

### 🌈 Temas de Desktop
5 temas de fundo disponíveis:
- 🌊 **Teal Classic** (padrão Windows 98)
- 💜 **Purple Reign**
- 🧱 **Brick Red**
- 🏜️ **Desert Sand**
- 💚 **Matrix Green**

### 📱 Design Responsivo
- **Mobile-first** com breakpoints inteligentes
- **Touch-friendly** - todos os botões têm tamanho mínimo de 44px
- **Gestos otimizados** para tablets e smartphones
- **Viewport dinâmico** usando dvh para melhor compatibilidade mobile
- **Scrollbars customizadas** estilo Windows 98
- **Font-size adaptativo** para prevenir zoom automático em iOS

### ♿ Acessibilidade
- **Títulos descritivos** em todos os botões
- **Suporte a teclado** (Enter para enviar formulários)
- **Prefers-reduced-motion** - respeita configurações do usuário
- **Contraste adequado** para legibilidade
- **Tap highlight removido** para melhor UX em mobile

## 🚀 Como Usar

### Criar uma Sala
1. Abra o aplicativo
2. Digite seu nome (opcional)
3. Escolha sua função
4. Clique em **"✨ Criar Nova Sala"**
5. Compartilhe o código gerado com sua equipe

### Entrar em uma Sala
1. Receba o código da sala do organizador
2. Digite seu nome e função
3. Digite o código da sala
4. Clique em **"🚪 Conectar"**

### Votar
1. Aguarde todos os participantes entrarem
2. Selecione sua estimativa (Fibonacci ou ☕ para break)
3. Quando todos votarem, clique em **"🎭 Revelar Estimativas"**
4. Discuta as diferenças
5. Clique em **"🔄 Nova Rodada"** para recomeçar

## 🎯 Easter Eggs Guide

### Para Descobrir Todos:
1. **Clippy**: Espere 5 segundos ou clique no ícone do desktop
2. **Shake Window**: Clique 7x no título "Scrum Poker - Planning Session"
3. **Secret Message**: Clique 10x no logo da Home
4. **Konami Code**: Abra o Menu Iniciar e digite: ↑↑↓↓←→←→BA
5. **Hidden Messages**: Explore tooltips e mensagens do Clippy

## 🛠️ Tech Stack

- **React 19** com TypeScript
- **Vite** para build ultra-rápido
- **Tailwind CSS 4** com tema customizado
- **PeerJS** para comunicação P2P
- **React Router** para navegação
- **LocalStorage** para persistência de tema

## 📦 Estrutura de Componentes

```
src/
├── components/
│   ├── Clippy.tsx          # Easter egg do Clippy
│   ├── DesktopIcon.tsx     # Ícones do desktop
│   ├── Dialog.tsx          # Modais de Ajuda/Sobre
│   ├── StartMenu.tsx       # Menu Iniciar
│   ├── ThemeSelector.tsx   # Seletor de temas
│   └── Toast.tsx           # Sistema de notificações
├── hooks/
│   ├── usePokerSession.ts  # Lógica WebRTC/PeerJS
│   └── useToast.ts         # Gerenciamento de toasts
├── pages/
│   ├── Home.tsx            # Tela de entrada
│   └── Poker.tsx           # Sala de Planning Poker
├── services/
│   └── signaling.ts        # Sinalização WebRTC
├── types/
│   └── poker.ts            # TypeScript types
└── index.css               # Estilos Win98 + animações
```

## 🎨 Customização de Tema

Os temas são salvos no localStorage e aplicados automaticamente:

```typescript
// Temas disponíveis
const themes = {
  teal: '#008080',    // Clássico
  purple: '#663399',  // Roxo
  brick: '#800000',   // Tijolo
  desert: '#c19a6b',  // Deserto
  matrix: '#003300'   // Matrix
}
```

## 🌐 Breakpoints Responsivos

```css
/* Extra Small (xs) */
@media (max-width: 480px)

/* Small (sm) */
@media (max-width: 640px)

/* Medium (md) */
@media (min-width: 768px)

/* Large (lg) */
@media (min-width: 1024px)
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint
```

## 🎭 Design Principles

1. **Nostalgia em Primeiro Lugar** - Cada detalhe remete ao Windows 98/XP
2. **Funcionalidade Moderna** - Tech stack atual com UX vintage
3. **Responsivo por Design** - Do smartphone ao desktop
4. **Easter Eggs Divertidos** - Momentos de alegria durante o planning
5. **Acessível e Inclusivo** - Para todos os dispositivos e usuários

## 🐛 Troubleshooting

### Conexão não funciona?
- Verifique se você está em uma rede que permite WebRTC
- Alguns firewalls corporativos bloqueiam P2P
- Tente recarregar a página

### Layout quebrado em mobile?
- Limpe o cache do navegador
- Verifique se está usando um navegador moderno
- Desative extensões que possam interferir

### Easter eggs não aparecem?
- Seja paciente (alguns são aleatórios)
- Tente os cliques secretos
- Explore o Menu Iniciar

## 📝 Licença

MIT - Use, modifique e compartilhe livremente!

## 🙏 Créditos

Inspirado no Windows 98, XP e no saudoso Clippy 📎

---

**Desenvolvido com ❤️ e nostalgia dos anos 90/2000**

*"Se você lembra do Windows 98, você provavelmente precisa de férias." 😄*
