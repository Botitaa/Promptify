import { useState, useCallback } from 'react'

const STORAGE_KEY = 'promptify_history'
const MAX_ITEMS = 50

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory)

  const addEntry = useCallback((entry) => {
    setHistory(prev => {
      const next = [{ ...entry, ts: Date.now(), id: crypto.randomUUID() }, ...prev].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  const removeEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { history, addEntry, clearHistory, removeEntry }
}
