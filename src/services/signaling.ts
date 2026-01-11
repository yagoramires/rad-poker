import type { WSMessage } from '../types/poker'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export async function getPeerId(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ws/id`, {
      signal: AbortSignal.timeout(10000)
    })
    if (!response.ok) {
      throw new Error(`Erro ao obter Peer ID: ${response.status} ${response.statusText}`)
    }
    const peerId = await response.text()
    if (!peerId || !peerId.trim()) {
      throw new Error('Peer ID vazio recebido do servidor')
    }
    return peerId.trim()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout ao conectar ao servidor. Verifique se o backend está rodando.')
      }
      throw error
    }
    throw new Error('Erro desconhecido ao obter Peer ID')
  }
}

export class SignalingClient {
  private serverUrl: string
  private ws: WebSocket | null = null
  private peerId: string | null = null
  private messageHandlers: Map<string, Set<(message: WSMessage) => void>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(serverUrl: string = WS_BASE_URL) {
    this.serverUrl = serverUrl
  }

  async connect(customPeerId: string | null = null): Promise<string> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] WebSocket já está conectado, ignorando reconexão')
      return this.peerId!
    }

    if (this.ws?.readyState === WebSocket.CONNECTING) {
      console.log('[WS] WebSocket está conectando, aguardando...')
      return this.peerId!
    }

    try {
      if (!customPeerId) {
        this.peerId = await getPeerId()
      } else {
        this.peerId = customPeerId
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao obter Peer ID'
      this.emit('error', { 
        type: 'ERROR', 
        src: this.peerId || '', 
        payload: { error: errorMessage } 
      })
      throw error
    }

    return new Promise((resolve, reject) => {
      const wsUrl = `${this.serverUrl}/api/peerjs?id=${this.peerId}`
      let connectionTimeout: ReturnType<typeof setTimeout> | null = null

      try {
        this.ws = new WebSocket(wsUrl)

        connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            this.ws?.close()
            const error = new Error('Timeout ao conectar WebSocket')
            this.emit('error', { 
              type: 'ERROR', 
              src: this.peerId || '', 
              payload: { error: error.message } 
            })
            reject(error)
          }
        }, 10000)

        this.ws.onopen = () => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout)
          }
          this.reconnectAttempts = 0
          this.reconnectDelay = 1000
          this.emit('open', { type: 'OPEN', src: this.peerId!, payload: {} })
          resolve(this.peerId!)
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WSMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('[WS] Erro ao processar mensagem:', error)
            this.emit('error', { 
              type: 'ERROR', 
              src: this.peerId || '', 
              payload: { error: 'Erro ao processar mensagem do servidor' } 
            })
          }
        }

        this.ws.onerror = (error) => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout)
          }
          const errorMessage = 'Erro de conexão WebSocket. Verifique se o servidor está rodando.'
          console.error('[WS] Erro:', error)
          this.emit('error', { 
            type: 'ERROR', 
            src: this.peerId || '', 
            payload: { error: errorMessage } 
          })
          reject(new Error(errorMessage))
        }

        this.ws.onclose = (event) => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout)
          }
          console.log('[WS] Desconectado', event.code, event.reason)
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.emit('close', { type: 'CLOSE', src: this.peerId!, payload: {} })
            this.attemptReconnect()
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.emit('error', { 
              type: 'ERROR', 
              src: this.peerId || '', 
              payload: { error: 'Não foi possível reconectar após várias tentativas' } 
            })
          }
        }
      } catch (error) {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout)
        }
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar WebSocket'
        reject(new Error(errorMessage))
      }
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Máximo de tentativas de reconexão atingido')
      return
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.reconnectDelay *= 2
      console.log(`[WS] Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      this.connect(this.peerId).catch(console.error)
    }, this.reconnectDelay)
  }

  private handleMessage(message: WSMessage) {
    if (message.type === 'OPEN') {
      console.log('[WS] Conexão estabelecida')
    }

    this.emit(message.type, message)
    this.emit('*', message)
  }

  sendMessage(message: WSMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const msgToSend = {
          ...message,
          src: this.peerId
        }
        this.ws.send(JSON.stringify(msgToSend))
      } catch (error) {
        console.error('[WS] Erro ao enviar mensagem:', error)
        throw new Error('Erro ao enviar mensagem. Verifique a conexão.')
      }
    } else {
      const error = new Error('WebSocket não está conectado')
      console.warn(error.message)
      throw error
    }
  }

  on(type: string, handler: (message: WSMessage) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set())
    }
    this.messageHandlers.get(type)!.add(handler)
  }

  off(type: string, handler: (message: WSMessage) => void) {
    this.messageHandlers.get(type)?.delete(handler)
  }

  private emit(type: string, message: WSMessage) {
    this.messageHandlers.get(type)?.forEach(handler => handler(message))
  }

  disconnect() {
    console.log('[WS] Desconectando WebSocket...')
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close(1000, 'Client disconnect')
      }
      this.ws = null
    }
    this.messageHandlers.clear()
  }

  getPeerId(): string | null {
    return this.peerId
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
