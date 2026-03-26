import React, { useState } from 'react'
import { generatePrompt, getClarifyingQuestions, CONTEXT_LABELS } from '../services/providers.js'
import ClarifyingQuestions from './ClarifyingQuestions.jsx'
import styles from './Tab.module.css'

export default function GenerateTab({ providerCtx, onSave }) {
  const [goal, setGoal] = useState('')
  const [context, setContext] = useState('general')
  const [mode, setMode] = useState('generate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState(null)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleRun = async () => {
    if (!goal.trim()) return setError('Describí tu objetivo primero.')
    setError(''); setResult(null); setQuestions(null); setLoading(true)
    try {
      if (mode === 'ask') {
        const data = await getClarifyingQuestions({ input: goal, context, type: 'generate', ...providerCtx })
        setQuestions(data.questions)
      } else {
        const data = await generatePrompt({ goal, context, ...providerCtx })
        setResult(data)
        onSave({ type: 'generate', context, goal, prompt: data.prompt })
      }
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleAnswers = async (answers) => {
    setQuestions(null); setLoading(true)
    try {
      const data = await generatePrompt({ goal, context, answers, ...providerCtx })
      setResult(data)
      onSave({ type: 'generate', context, goal, prompt: data.prompt })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(result.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const clear = () => { setGoal(''); setResult(null); setQuestions(null); setError('') }

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <label className={styles.label}>¿Qué querés lograr?</label>
        <textarea className={styles.textarea} value={goal} onChange={e => setGoal(e.target.value)} placeholder="Describí tu objetivo. Ej: Necesito que Claude me ayude a revisar código Python buscando errores de lógica..." rows={5} />
        <p className={styles.tip}>Cuanto más contexto des, mejor será el prompt generado.</p>
      </div>
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label}>Contexto</label>
          <select className={styles.select} value={context} onChange={e => setContext(e.target.value)}>
            {Object.entries(CONTEXT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Modo</label>
          <select className={styles.select} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="generate">Generar directamente</option>
            <option value="ask">Hacerme preguntas primero</option>
          </select>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleRun} disabled={loading || !goal.trim()}>
          {loading ? <><span className={styles.spinner} /> Procesando...</> : 'Generar prompt'}
        </button>
        <button className={styles.btnSecondary} onClick={clear}>Limpiar</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {questions && <ClarifyingQuestions questions={questions} onSubmit={handleAnswers} />}
      {result && (
        <div className={styles.resultArea}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>Prompt generado</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={styles.badgeGreen}>{CONTEXT_LABELS[context]}</span>
              <button className={styles.copyBtn} onClick={copy}>{copied ? '¡copiado!' : 'copiar'}</button>
            </div>
          </div>
          <pre className={styles.resultBody}>{result.prompt}</pre>
          <div className={styles.resultHeader} style={{ borderTop: '0.5px solid var(--border)' }}>
            <span className={styles.resultLabel}>Cómo usarlo</span>
          </div>
          <div className={styles.resultBody}>{result.howToUse}</div>
        </div>
      )}
    </div>
  )
}
