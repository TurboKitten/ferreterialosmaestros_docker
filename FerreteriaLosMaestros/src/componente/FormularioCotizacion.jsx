import { useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { validarCampos, validarEmail, validarLargo, validarRequerido, validarRut } from '../utils/validaciones'

export default function FormularioCotizacion() {
  const [datos, setDatos] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    tipoCliente: '',
    comuna: '',
    mensaje: '',
  })
  const [errores, setErrores] = useState({})
  const [exito, setExito] = useState(false)

  const cambiar = (campo) => (e) => {
    setDatos((actual) => ({ ...actual, [campo]: e.target.value }))
    setExito(false)
  }

  const reglas = {
    nombre: (valor) =>
      !validarRequerido(valor)
        ? 'El nombre completo es obligatorio.'
        : !validarLargo(valor, 3)
          ? 'El nombre debe tener al menos 3 caracteres.'
          : null,
    rut: (valor) =>
      !validarRequerido(valor)
        ? 'El RUT es obligatorio.'
        : !validarRut(valor)
          ? 'El RUT ingresado no es válido.'
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
    tipoCliente: (valor) => (!validarRequerido(valor) ? 'Selecciona tu perfil.' : null),
    comuna: (valor) => (!validarRequerido(valor) ? 'La comuna o dirección es obligatoria.' : null),
    mensaje: (valor) =>
      !validarRequerido(valor)
        ? 'El detalle de materiales es obligatorio.'
        : !validarLargo(valor, 10)
          ? 'El detalle debe tener al menos 10 caracteres.'
          : null,
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevosErrores = validarCampos(datos, reglas)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length === 0) {
      setExito(true)
      setDatos({
        nombre: '',
        rut: '',
        email: '',
        telefono: '',
        tipoCliente: '',
        comuna: '',
        mensaje: '',
      })
    }
  }

  return (
    <div className="form-card shadow-sm">
      <div className="text-center mb-4">
        <span className="badge bg-warning text-dark fw-bold text-uppercase px-3 py-1 mb-2">
          Atención Inmediata
        </span>
        <h2 className="h3 fw-bold" id="contactoTitle">Solicitud de Cotización</h2>
        <p className="text-muted small mb-0">
          Completa los datos requeridos para que un ejecutivo de ventas te envíe una
          cotización formal con disponibilidad y precio por encargo.
        </p>
      </div>

      <div id="quoteResultCard" role="region" aria-live="polite">
        {exito && (
          <AlertaBootstrap tipo="success">
            ¡Solicitud enviada! Un ejecutivo de ventas se contactará contigo con la cotización.
          </AlertaBootstrap>
        )}
      </div>

      <form id="contactForm" noValidate onSubmit={enviar}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="contactNombre" className="form-label">
              Nombre Completo <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              id="contactNombre"
              name="nombre"
              placeholder="Ej: Juan"
              value={datos.nombre}
              onChange={cambiar('nombre')}
            />
            <div className="invalid-feedback">{errores.nombre}</div>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="contactRut" className="form-label">
              RUT Personal o Empresa <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errores.rut ? 'is-invalid' : ''}`}
              id="contactRut"
              name="rut"
              placeholder="Ej: 12.345.678-9"
              value={datos.rut}
              onChange={cambiar('rut')}
            />
            <div className="invalid-feedback">{errores.rut}</div>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="contactEmail" className="form-label">
              Correo Electrónico <span className="req">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              id="contactEmail"
              name="email"
              placeholder="ejemplo@constructora.cl"
              value={datos.email}
              onChange={cambiar('email')}
            />
            <div className="invalid-feedback">{errores.email}</div>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="contactTelefono" className="form-label">
              Teléfono o WhatsApp <span className="req">*</span>
            </label>
            <input
              type="tel"
              className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
              id="contactTelefono"
              name="telefono"
              placeholder="+56 9 1234 5678"
              value={datos.telefono}
              onChange={cambiar('telefono')}
            />
            <div className="invalid-feedback">{errores.telefono}</div>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="contactTipoCliente" className="form-label">
              Tipo de Cliente <span className="req">*</span>
            </label>
            <select
              className={`form-select ${errores.tipoCliente ? 'is-invalid' : ''}`}
              id="contactTipoCliente"
              name="tipoCliente"
              value={datos.tipoCliente}
              onChange={cambiar('tipoCliente')}
            >
              <option value="">-- Selecciona tu perfil --</option>
              <option value="Particular / Hogar">Particular / Proyecto Hogar</option>
              <option value="Maestro Independiente">Maestro Independiente / Especialista</option>
              <option value="Empresa Contratista">Empresa Contratista / Constructora</option>
            </select>
            <div className="invalid-feedback">{errores.tipoCliente}</div>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="contactComuna" className="form-label">
              Comuna o Dirección de Obra <span className="req">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
              id="contactComuna"
              name="comuna"
              placeholder="Ej: Coquimbo, La Serena"
              value={datos.comuna}
              onChange={cambiar('comuna')}
            />
            <div className="invalid-feedback">{errores.comuna}</div>
          </div>

          <div className="col-12">
            <label htmlFor="contactMensaje" className="form-label">
              Detalle de Materiales a Cotizar <span className="req">*</span>
            </label>
            <textarea
              className={`form-control font-monospace small ${errores.mensaje ? 'is-invalid' : ''}`}
              id="contactMensaje"
              name="mensaje"
              rows="4"
              placeholder="Indica cantidades, especificaciones técnicas o códigos requeridos (Ej: 23 sacos de cemento Polpaico 25kg, 3 destornillador...)"
              value={datos.mensaje}
              onChange={cambiar('mensaje')}
            />
            <div className="invalid-feedback">{errores.mensaje}</div>
          </div>

          <div className="col-12 text-end pt-2">
            <button type="submit" className="btn btn-primary btn-lg fw-bold px-5" id="submitContactBtn">
              <i className="bi bi-send me-2" /> Enviar Solicitud de Cotización
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}