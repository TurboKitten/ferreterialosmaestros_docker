import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AlertaBootstrap from './AlertaBootstrap'
import { loginApi, notificarSesion } from '../services/almacen'
import { validarRequerido } from '../utils/validaciones'

function destinoSegunRol(rol) {
  const rolNormalizado = String(rol || '').toLowerCase()
  if (rolNormalizado === 'administrador') return '/admin'
  if (rolNormalizado === 'vendedor') return '/vendedor'
  return '/'
}

export default function FormularioAcceso() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)

  const enviar = async (e) => {
    e.preventDefault()

    const nuevosErrores = {}
    if (!validarRequerido(usuario)) {
      nuevosErrores.usuario = 'Debes ingresar tu nombre de usuario.'
    }
    if (!validarRequerido(password)) {
      nuevosErrores.password = 'Debes ingresar tu contraseña.'
    }
    setErrores(nuevosErrores)
    setMensaje(null)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    try {
      const sesion = await loginApi(usuario.trim(), password)
      notificarSesion()
      navigate(destinoSegunRol(sesion.rol))
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: err.message || 'El usuario o la contraseña son incorrectos.' })
    }
  }

  return (
    <div className="login-box mx-auto">
      <Link to="/" className="text-decoration-none">
        <div className="text-center mb-4">
          <span className="brand-icon mx-auto mb-2 d-flex" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            <i className="bi bi-tools" />
          </span>
          <h1 className="h4 fw-bold text-dark mb-1">Ferretería Los Maestros</h1>
          <p className="text-muted small mb-0">Ingreso a su cuenta.</p>
        </div>
      </Link>

      {mensaje && <AlertaBootstrap tipo={mensaje.tipo} onClose={() => setMensaje(null)}>{mensaje.texto}</AlertaBootstrap>}

      <form id="formularioLogin" noValidate onSubmit={enviar}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombre de Usuario <span className="req">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-person" /></span>
            <input
              type="text"
              className={`form-control ${errores.usuario ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              placeholder="Ej: dgarrid"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="invalid-feedback">{errores.usuario}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña <span className="req">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock" /></span>
            <input
              type="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="invalid-feedback">{errores.password}</div>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
          <i className="bi bi-box-arrow-in-right me-1" /> Ingresar al Sistema
        </button>
      </form>

      <div className="text-center">
        <Link to="/" className="text-decoration-none text-muted small">
          <i className="bi bi-arrow-left me-1" /> Volver a menú principal
        </Link>
      </div>
    </div>
  )
}