import type { PlayerRole } from '../types/poker'

const STORAGE_KEYS = {
  PLAYER_NAME: 'poker_player_name',
  PLAYER_ROLE: 'poker_player_role'
} as const

export function getCachedPlayerName(): string {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || ''
  } catch {
    return ''
  }
}

export function getCachedPlayerRole(): PlayerRole {
  if (typeof window === 'undefined') return 'other'
  try {
    const role = localStorage.getItem(STORAGE_KEYS.PLAYER_ROLE)
    const validRoles: PlayerRole[] = ['frontend', 'backend', 'fullstack', 'designer', 'product', 'qa', 'other']
    return (role && validRoles.includes(role as PlayerRole)) ? (role as PlayerRole) : 'other'
  } catch {
    return 'other'
  }
}

export function setCachedPlayerName(name: string): void {
  if (typeof window === 'undefined') return
  try {
    if (name.trim()) {
      localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name.trim())
    } else {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME)
    }
  } catch {
    console.error('Error setting cached player name:', name)
  }
}

export function setCachedPlayerRole(role: PlayerRole): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_ROLE, role)
  } catch {
    console.error('Error setting cached player role:', role)
  }
}

export function clearPlayerCache(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_NAME)
    localStorage.removeItem(STORAGE_KEYS.PLAYER_ROLE)
  } catch {
    console.error('Error clearing player cache')
  }
}
