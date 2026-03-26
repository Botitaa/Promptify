import React, { useState } from 'react'
import styles from './ClarifyingQuestions.module.css'

export default function ClarifyingQuestions({ questions, onSubmit }) {
  const [answers, setAnswers] = useState(questions.map(() => ''))

  const setAnswer = (i, val) => {
    const next = [...answers]
    next[i] = val
    setAnswers(next)
  }

  const handleSubmit = () => {
    onSubmit(questions.map((q, i) => ({ q, a: answers[i] })))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerText}>Preguntas para mejorar el resultado</span>
      </div>
      {questions.map((q, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.questionText}>{i + 1}. {q}</div>
          <textarea
            className={styles.answer}
            value={answers[i]}
            onChange={e => setAnswer(i, e.target.value)}
            placeholder="Tu respuesta..."
            rows={2}
          />
        </div>
      ))}
      <div className={styles.footer}>
        <button className={styles.btn} onClick={handleSubmit}>
          Continuar con estas respuestas
        </button>
      </div>
    </div>
  )
}
