import React, { useState } from 'react'
import { improvePrompt, getClarifyingQuestions, CONTEXT_LABELS } from '../services/providers.js'
import ClarifyingQuestions from './ClarifyingQuestions.jsx'
import ResultCompare from './ResultCompare.jsx'
import styles from './Tab.module.css'

export default function ImproveTab({ providerCtx, onSave }) {
  const [original, setOriginal] = useState('')
  const [context, setContext] = useState('general')
  const [mode, setMode] = useState('improve')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState(null)
  const [result, setResult] = useState(null)

  const handleRun = async () => {
    if (!original.trim()) return setError('Escribí un prompt primero.')
    setError(''); setResult(null); setQuestions(null); setLoading(true)
    try {
      if (mode === 'ask') {
        const data = await getClarifyingQuestions({ input: original, context, type: 'improve', ...providerCtx })
        setQuestions(data.questions)
      } else {
        const data = await improvePrompt({ original, context, ...providerCtx })
        setResult(data)
        onSave({ type: 'improve', context, original, improved: data.improved })
      }
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const handleAnswers = async (answers) => {
    setQuestions(null); setLoading(true)
    try {
      const data = await improvePrompt({ original, context, answers, ...providerCtx })
      setResult(data)
      onSave({ type: 'improve', context, original, improved: data.improved })
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const clear = () => { setOriginal(''); setResult(null); setQuestions(null); setError('') }

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <label className={styles.label}>Tu prompt original</label>
        <textarea className={styles.textarea} value={original} onChange={e => setOriginal(e.target.value)} placeholder="Pegá acá tu prompt..." rows={5} />
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
            <option value="improve">Mejorar directamente</option>
            <option value="ask">Hacerme preguntas primero</option>
          </select>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleRun} disabled={loading || !original.trim()}>
          {loading ? <><span className={styles.spinner} /> Procesando...</> : 'Mejorar prompt'}
        </button>
        <button className={styles.btnSecondary} onClick={clear}>Limpiar</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {questions && <ClarifyingQuestions questions={questions} onSubmit={handleAnswers} />}
      {result && <ResultCompare original={original} improved={result.improved} explanation={result.explanation} />}
    </div>
  )
}
