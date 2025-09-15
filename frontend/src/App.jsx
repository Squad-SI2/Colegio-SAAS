
import { useState } from 'react'

export default function App() {
  const [msg, setMsg] = useState('Pulsa "Ping" o "Echo"')

  const ping = async () => {
    setMsg('Consultando /api/hello/ ...')
    try {
      const r = await fetch('/api/hello/')
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      setMsg(`${data.msg} @ ${data.time}`)
    } catch (e) {
      setMsg('Error: ' + e.message)
    }
  }

  const echo = async () => {
    setMsg('Enviando a /api/echo/ ...')
    try {
      const r = await fetch('/api/echo/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: 'hola' })
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      setMsg(`Echo: ${JSON.stringify(data.received)} @ ${data.at}`)
    } catch (e) {
      setMsg('Error: ' + e.message)
    }
  }

  return (
    <div style={{ fontFamily:'system-ui', padding:24 }}>
      <h1>Colegio — Conexión DRF</h1>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={ping}>Ping (GET /api/hello/)</button>
        <button onClick={echo}>Echo (POST /api/echo/)</button>
      </div>
      <pre style={{ background:'#f5f5f5', padding:12 }}>{msg}</pre>
    </div>
  )
}

