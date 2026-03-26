import React from 'react'
import { CONTEXT_LABELS } from '../services/claude.js'
import styles from './HistoryTab.module.css'

export default function HistoryTab({ history, onLoad, onClear, onRemove }) {
  if (!history.length) {
    return (
      <div className={styles.empty}>
        <p>Todavía no hay nada guardado.</p>
        <p className={styles.emptyHint}>Los prompts mejorados y generados aparecen acá automáticamente.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <span className={styles.count}>{history.length} entradas</span>
        <button className={styles.clearBtn} onClick={onClear}>Borrar todo</button>
      </div>
      <div className={styles.list}>
        {history.map((item) => {
          const date = new Date(item.ts)
          const dateStr = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) + ' ' +
            date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
          const preview = item.type === 'improve' ? item.original : item.goal

          return (
            <div key={item.id} className={styles.item} onClick={() => onLoad(item)}>
              <div className={styles.itemMeta}>
                <span className={item.type === 'improve' ? styles.badgeGreen : styles.badgeAmber}>
                  {item.type === 'improve' ? 'mejorado' : 'generado'}
                </span>
                <span className={styles.badgeGray}>{CONTEXT_LABELS[item.context]}</span>
                <span className={styles.time}>{dateStr}</span>
                <button
                  className={styles.removeBtn}
                  onClick={e => { e.stopPropagation(); onRemove(item.id) }}
                >✕</button>
              </div>
              <div className={styles.preview}>{preview}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
