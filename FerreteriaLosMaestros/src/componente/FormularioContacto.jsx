import { useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { validarCampos, validarEmail, validarLargo, validarRequerido } from '../utils/validaciones'

const MOTIVOS = [
  'Cotización de Materiales',
  'Consulta de Stock',
  'Despacho a Obra',
  'Cuenta Corriente Contratista',
  'Servicio al Cliente',
]

export default function FormularioContacto() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: '',
  })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const cambiar = (campo) => (e) => {
    setDatos((actual) => ({ ...actual, [campo]: e.target.value }))
    setEnviado(false)
  }

  const reglas = {
    nombre: (valor) =>
      !validarRequerido(valor)
        ? 'El nombre y apellido son obligatorios.'
        : !validarLargo(valor, 3)
          ? 'El nombre debe tener al menos 3 caracteres.'
          : null,
    email: (valor) =>
      !validarRequerido(valor)
        ? 'El correo electrónico es obligatorio.'
        : !validarEmail(valor)
          ? 'El formato del correo no es válido.'
          : null,
    telefono: (valor) =>
      !validarRequerido(valor)
        ? 'El teléfono es obligatorio.'
        : !validarLargo(valor, 8)
          ? 'El teléfono debe tener al menos 8 caracteres.'
          : null,
    motivo: (valor) =>
      !validarRequerido(valor) ? 'Selecciona un motivo de consulta.' : null,
    mensaje: (valor) =>
      !validarRequerido(valor)
        ? 'El mensaje es obligatorio.'
        : !validarLargo(valor, 6)
          ? 'El mensaje debe tener al menos 6 caracteres.'
          : null,
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevosErrores = validarCampos(datos, reglas)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true)
      setDatos({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' })
    }
  }

  return (
    <div className="card mi-cuadro-contacto shadow-sm border-0 p-4 p-md-5 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 fw-bold mb-0 text-dark">
          <i className="bi bi-envelope-paper-heart text-primary me-2" />Escribenos tu Consulta
        </h2>
        <span className="small text-muted">
          <span className="text-danger">*</span> Campos requeridos
        </span>
      </div>

      {enviado && (
        <AlertaBootstrap tipo="success">
          ¡Gracias por escribirnos! Te responderemos a la brevedad.
        </AlertaBootstrap>
      )}

      <form id="formularioContacto" noValidate onSubmit={enviar}>
        <div className="mb-3">
          <label htmlFor="contactoNombre" className="form-label">
            Nombre y Apellido <span className="req">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-person" /></span>
            <input
              type="text"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              id="contactoNombre"
              name="nombre"
              placeholder="Ej: Juan Pérez"
              value={datos.nombre}
              onChange={cambiar('nombre')}
            />
          </div>
          <div className="invalid-feedback">{errores.nombre}</div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6">
            <label htmlFor="contactoEmail" className="form-label">
              Correo Electrónico <span className="req">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope" /></span>
              <input
                type="email"
                className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                id="contactoEmail"
                name="email"
                placeholder="usuario@correo.cl"
                value={datos.email}
                onChange={cambiar('email')}
              />
            </div>
            <div className="invalid-feedback">{errores.email}</div>
          </div>

          <div className="col-12 col-sm-6">
            <label htmlFor="contactoTelefono" className="form-label">
              Teléfono de Contacto <span className="req">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-telephone" /></span>
              <input
                type="tel"
                className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                id="contactoTelefono"
                name="telefono"
                placeholder="+56 9 1234 5678"
                value={datos.telefono}
                onChange={cambiar('telefono')}
              />
            </div>
            <div className="invalid-feedback">{errores.telefono}</div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="contactoMotivo" className="form-label">
            Motivo de tu Consulta <span className="req">*</span>
          </label>
          <select
            className={`form-select ${errores.motivo ? 'is-invalid' : ''}`}
            id="contactoMotivo"
            name="motivo"
            value={datos.motivo}
            onChange={cambiar('motivo')}
          >
            <option value="">-- Selecciona el motivo --</option>
            {MOTIVOS.map((motivo) => (
              <option key={motivo} value={motivo}>{motivo}</option>
            ))}
          </select>
          <div className="invalid-feedback">{errores.motivo}</div>
        </div>

        <div className="mb-4">
          <label htmlFor="contactoMensaje" className="form-label">
            Mensaje o Detalle de Productos <span className="req">*</span>
          </label>
          <textarea
            className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
            id="contactoMensaje"
            name="mensaje"
            rows="4"
            placeholder="Indica los materiales que necesitas, cantidades o tu consulta específica..."
            value={datos.mensaje}
            onChange={cambiar('mensaje')}
          />
          <div className="invalid-feedback">{errores.mensaje}</div>
          <div className="form-text small">
            Si tienes una lista de materiales, puedes escribirla aquí indicando las cantidades.
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 fw-bold"
            id="btnEnviarContacto"
          >
            <i className="bi bi-send-fill me-1" /> Enviar Mensaje
          </button>
        </div>
      </form>
    </div>
  )
}