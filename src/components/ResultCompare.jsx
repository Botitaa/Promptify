import React, { useState } from 'react'
import styles from './ResultCompare.module.css'

export default function ResultCompare({ original, improved, explanation }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(improved)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <div className={styles.colHeader}>Original</div>
          <pre className={styles.colBody}>{original}</pre>
        </div>
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span>Mejorado</span>
            <button className={styles.copyBtn} onClick={copy}>{copied ? '¡copiado!' : 'copiar'}</button>
          </div>
          <pre className={styles.colBody}>{improved}</pre>
        </div>
      </div>
      {explanation && (
        <div className={styles.explanation}>
          <div className={styles.explanationHeader}>Por qué es mejor</div>
          <div className={styles.explanationBody}>{explanation}</div>
        </div>
      )}
    </div>
  )
}
