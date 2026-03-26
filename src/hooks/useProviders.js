import { useState } from 'react'
import { PROVIDERS } from '../services/providers.js'

const KEYS_STORAGE = 'promptify_keys'
const SELECTION_STORAGE = 'promptify_selection'

function loadKeys() {
  try { return JSON.parse(localStorage.getItem(KEYS_STORAGE) || '{}') } catch { return {} }
}

function loadSelection() {
  try {
    const saved = JSON.parse(localStorage.getItem(SELECTION_STORAGE) || '{}')
    const providerId = saved.providerId || 'anthropic'
    const provider = PROVIDERS[providerId]
    const model = saved.model || provider.models[0].id
    return { providerId, model }
  } catch {
    return { providerId: 'anthropic', model: PROVIDERS.anthropic.models[0].id }
  }
}

export function useProviders() {
  const [keys, setKeysState] = useState(loadKeys)
  const [selection, setSelectionState] = useState(loadSelection)

  const { providerId, model } = selection
  const apiKey = keys[providerId] || ''
  const provider = PROVIDERS[providerId]

  const setApiKey = (key) => {
    const next = { ...keys, [providerId]: key }
    localStorage.setItem(KEYS_STORAGE, JSON.stringify(next))
    setKeysState(next)
  }

  const setProvider = (newProviderId) => {
    const newProvider = PROVIDERS[newProviderId]
    const newModel = newProvider.models[0].id
    const next = { providerId: newProviderId, model: newModel }
    localStorage.setItem(SELECTION_STORAGE, JSON.stringify(next))
    setSelectionState(next)
  }

  const setModel = (newModel) => {
    const next = { ...selection, model: newModel }
    localStorage.setItem(SELECTION_STORAGE, JSON.stringify(next))
    setSelectionState(next)
  }

  const clearKey = () => {
    const next = { ...keys }
    delete next[providerId]
    localStorage.setItem(KEYS_STORAGE, JSON.stringify(next))
    setKeysState(next)
  }

  return { providerId, model, apiKey, provider, setApiKey, setProvider, setModel, clearKey }
}
