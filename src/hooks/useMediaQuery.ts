import { useEffect, useState } from 'react'

interface UseMediaQueryOptions {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
): boolean {
  const { defaultValue = false, initializeWithValue = true } = options

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue && typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return defaultValue
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    const updateMatches = () => {
      setMatches(mediaQuery.matches)
    }

    queueMicrotask(updateMatches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
