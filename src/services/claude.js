const API_URL = 'https://api.anthropic.com/v1/messages'

export async function callClaude(systemPrompt, userMessage, apiKey) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Error en la API de Claude')
  return data.content[0].text
}

export const CONTEXT_LABELS = {
  general: 'General',
  coding: 'Código',
  analysis: 'Análisis',
  writing: 'Escritura',
  study: 'Estudio',
  business: 'Negocio',
}

export async function improvePrompt({ original, context, answers = [], apiKey }) {
  const answersText = answers.length
    ? '\n\nContexto adicional:\n' + answers.map(a => `- ${a.q}: ${a.a}`).join('\n')
    : ''

  const sys = `Sos un experto en prompt engineering especializado en Claude. Mejorá el prompt del usuario haciéndolo más claro, específico y efectivo para el contexto indicado. Respondé SOLO en JSON válido sin markdown: {"improved": "el prompt mejorado", "explanation": "qué mejoraste y por qué (3-4 oraciones)"}`

  const text = await callClaude(sys, `Contexto: ${CONTEXT_LABELS[context]}\nPrompt original: ${original}${answersText}`, apiKey)
  return JSON.parse(text)
}

export async function generatePrompt({ goal, context, answers = [], apiKey }) {
  const answersText = answers.length
    ? '\n\nContexto adicional:\n' + answers.map(a => `- ${a.q}: ${a.a}`).join('\n')
    : ''

  const sys = `Sos un experto en prompt engineering para Claude. Generá un prompt optimizado basado en el objetivo del usuario. Incluí rol, contexto, instrucciones claras y formato esperado. Respondé SOLO en JSON válido sin markdown: {"prompt": "el prompt generado", "howToUse": "cómo usarlo y qué esperar (2-3 oraciones)"}`

  const text = await callClaude(sys, `Contexto: ${CONTEXT_LABELS[context]}\nObjetivo: ${goal}${answersText}`, apiKey)
  return JSON.parse(text)
}

export async function getClarifyingQuestions({ input, context, type, apiKey }) {
  const sys = `Sos un experto en prompt engineering. Hacé exactamente 3 preguntas cortas y específicas que te ayuden a ${type === 'improve' ? 'mejorar el prompt' : 'entender mejor el objetivo'}. Respondé SOLO en JSON válido sin markdown: {"questions": ["pregunta1", "pregunta2", "pregunta3"]}`

  const text = await callClaude(sys, `Contexto: ${CONTEXT_LABELS[context]}\n${type === 'improve' ? 'Prompt' : 'Objetivo'}: ${input}`, apiKey)
  return JSON.parse(text)
}
