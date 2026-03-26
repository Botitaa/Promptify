import React, { useState } from 'react'
import { PROVIDERS } from '../services/providers.js'
import styles from './ApiKeySetup.module.css'

const PROVIDER_LIST = Object.values(PROVIDERS)

export default function ApiKeySetup({ providerId, provider, onSave, onChangeProvider }) {
  const [value, setValue] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSave(value.trim())
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>prompt<span>ify</span></div>

        <div className={styles.providerSection}>
          <p className={styles.providerLabel}>Elegí el proveedor</p>
          <div className={styles.providerGrid}>
            {PROVIDER_LIST.map(p => (
              <button
                key={p.id}
                className={`${styles.providerBtn} ${p.id === providerId ? styles.providerBtnActive : ''}`}
                onClick={() => { onChangeProvider(p.id); setValue('') }}
                type="button"
              >
                <span className={styles.providerName}>{p.name}</span>
                <span className={styles.providerCompany}>{p.company}</span>
              </button>
            ))}
          </div>
        </div>

        <p className={styles.desc}>
          Ingresá tu API key de <strong>{provider.company}</strong>.<br />
          Se guarda localmente, nunca sale de tu navegador.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputRow}>
            <input
              type={show ? 'text' : 'password'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={provider.keyPlaceholder}
              className={styles.input}
              autoFocus
            />
            <button type="button" className={styles.toggle} onClick={() => setShow(s => !s)}>
              {show ? 'ocultar' : 'ver'}
            </button>
          </div>
          <button type="submit" className={styles.btn} disabled={!value.trim()}>
            Empezar con {provider.name}
          </button>
        </form>

        <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Obtener API key de {provider.company} →
        </a>
      </div>
    </div>
  )
}
