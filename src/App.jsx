import React, { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import ImproveTab from './components/ImproveTab.jsx'
import GenerateTab from './components/GenerateTab.jsx'
import HistoryTab from './components/HistoryTab.jsx'
import { useProviders } from './hooks/useProviders.js'
import { useHistory } from './hooks/useHistory.js'
import { PROVIDERS } from './services/providers.js'
import styles from './App.module.css'

const TABS = [
  { id: 'improve', label: 'Mejorar prompt' },
  { id: 'generate', label: 'Generar desde cero' },
  { id: 'history', label: 'Historial' },
]

export default function App() {
  const { providerId, model, apiKey, provider, setApiKey, setProvider, setModel, clearKey } = useProviders()
  const { history, addEntry, clearHistory, removeEntry } = useHistory()
  const [activeTab, setActiveTab] = useState('improve')

  const providerCtx = { providerId, model, apiKey }

  if (!apiKey) {
    return (
      <ApiKeySetup
        providerId={providerId}
        provider={provider}
        onSave={setApiKey}
        onChangeProvider={setProvider}
      />
    )
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>prompt<span>ify</span></div>
        <div className={styles.headerRight}>
          <div className={styles.modelSelector}>
            <select
              className={styles.providerSelect}
              value={providerId}
              onChange={e => setProvider(e.target.value)}
            >
              {Object.values(PROVIDERS).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              className={styles.modelSelect}
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              {provider.models.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <button className={styles.keyBtn} onClick={clearKey} title="Cambiar API key">
            API key
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === 'history' && history.length > 0 && (
                <span className={styles.tabBadge}>{history.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'improve' && (
            <ImproveTab providerCtx={providerCtx} onSave={addEntry} />
          )}
          {activeTab === 'generate' && (
            <GenerateTab providerCtx={providerCtx} onSave={addEntry} />
          )}
          {activeTab === 'history' && (
            <HistoryTab
              history={history}
              onLoad={(item) => setActiveTab(item.type === 'improve' ? 'improve' : 'generate')}
              onClear={clearHistory}
              onRemove={removeEntry}
            />
          )}
        </div>
      </main>
    </div>
  )
}
