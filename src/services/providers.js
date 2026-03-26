export const PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    name: 'Claude',
    company: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { id: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
      { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
    ],
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  openai: {
    id: 'openai',
    name: 'GPT',
    company: 'OpenAI',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
      { id: 'o1', label: 'o1' },
    ],
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  google: {
    id: 'google',
    name: 'Gemini',
    company: 'Google',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    ],
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
}

export const CONTEXT_LABELS = {
  general: 'General',
  coding: 'Código',
  analysis: 'Análisis',
  writing: 'Escritura',
  study: 'Estudio',
  business: 'Negocio',
}

async function callAnthropic(apiKey, model, systemPrompt, userMessage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Error en Anthropic API')
  return data.content[0].text
}

async function callOpenAI(apiKey, model, systemPrompt, userMessage) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Error en OpenAI API')
  return data.choices[0].message.content
}

async function callGoogle(apiKey, model, systemPrompt, userMessage) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 1500 },
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Error en Google API')
  return data.candidates[0].content.parts[0].text
}

export async function callProvider({ providerId, model, apiKey, systemPrompt, userMessage }) {
  switch (providerId) {
    case 'anthropic': return callAnthropic(apiKey, model, systemPrompt, userMessage)
    case 'openai':    return callOpenAI(apiKey, model, systemPrompt, userMessage)
    case 'google':    return callGoogle(apiKey, model, systemPrompt, userMessage)
    default: throw new Error(`Proveedor desconocido: ${providerId}`)
  }
}

export async function improvePrompt({ original, context, answers = [], providerId, model, apiKey }) {
  const answersText = answers.length
    ? '\n\nContexto adicional:\n' + answers.map(a => `- ${a.q}: ${a.a}`).join('\n')
    : ''
  const sys = `Sos un experto en prompt engineering. Mejorá el prompt del usuario haciéndolo más claro, específico y efectivo para el contexto indicado. Respondé SOLO en JSON válido sin markdown: {"improved": "el prompt mejorado", "explanation": "qué mejoraste y por qué (3-4 oraciones)"}`
  const text = await callProvider({ providerId, model, apiKey, systemPrompt: sys, userMessage: `Contexto: ${CONTEXT_LABELS[context]}\nPrompt original: ${original}${answersText}` })
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

export async function generatePrompt({ goal, context, answers = [], providerId, model, apiKey }) {
  const answersText = answers.length
    ? '\n\nContexto adicional:\n' + answers.map(a => `- ${a.q}: ${a.a}`).join('\n')
    : ''
  const sys = `Sos un experto en prompt engineering. Generá un prompt optimizado basado en el objetivo del usuario. Incluí rol, contexto, instrucciones claras y formato esperado. Respondé SOLO en JSON válido sin markdown: {"prompt": "el prompt generado", "howToUse": "cómo usarlo y qué esperar (2-3 oraciones)"}`
  const text = await callProvider({ providerId, model, apiKey, systemPrompt: sys, userMessage: `Contexto: ${CONTEXT_LABELS[context]}\nObjetivo: ${goal}${answersText}` })
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

export async function getClarifyingQuestions({ input, context, type, providerId, model, apiKey }) {
  const sys = `Sos un experto en prompt engineering. Hacé exactamente 3 preguntas cortas y específicas que te ayuden a ${type === 'improve' ? 'mejorar el prompt' : 'entender mejor el objetivo'}. Respondé SOLO en JSON válido sin markdown: {"questions": ["pregunta1", "pregunta2", "pregunta3"]}`
  const text = await callProvider({ providerId, model, apiKey, systemPrompt: sys, userMessage: `Contexto: ${CONTEXT_LABELS[context]}\n${type === 'improve' ? 'Prompt' : 'Objetivo'}: ${input}` })
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}
