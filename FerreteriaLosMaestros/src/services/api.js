const BASE = import.meta.env.VITE_API_URL || '/api'
const CLAVE_SESION = 'sesionActiva'

// El token JWT se guarda en la sesión (localStorage) y se envía en cada request.
function obtenerToken() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION)
    const sesion = raw ? JSON.parse(raw) : null
    return sesion?.token || null
  } catch {
    return null
  }
}

// Si el backend responde 401 con un token presente, la sesión ya no es válida: se cierra.
function cerrarSesionSiExpirada(habiaToken) {
  if (!habiaToken) return
  localStorage.removeItem(CLAVE_SESION)
  window.dispatchEvent(new Event('ferreteria:sesion'))
}

async function request(path, options = {}) {
  const token = obtenerToken()
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }

  if (!res.ok) {
    if (res.status === 401) cerrarSesionSiExpirada(token)
    const msg = (data && (data.message || data.error)) || `Error ${res.status}`
    throw new Error(msg)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}
