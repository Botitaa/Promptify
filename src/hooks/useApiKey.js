import { useState } from 'react'

const KEY = 'promptify_apikey'

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(KEY) || '')

  const setApiKey = (key) => {
    localStorage.setItem(KEY, key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem(KEY)
    setApiKeyState('')
  }

  return { apiKey, setApiKey, clearApiKey }
}
