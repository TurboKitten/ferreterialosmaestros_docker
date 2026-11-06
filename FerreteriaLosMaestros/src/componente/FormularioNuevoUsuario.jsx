import { useEffect, useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { cargarUsuarios, fetchUsuarios, guardarUsuarios } from '../services/almacen'
import { validarRequerido } from '../utils/validaciones'

const ROLES_POSIBLES = ['Vendedor', 'Contratista', 'Administrador']

export default function FormularioNuevoUsuario() {
  const [usuarios, setUsuarios] = useState(() => cargarUsuarios())
  const [datos, setDatos] = useState({ nombre: '', usuario: '', password: '', rol: 'Vendedor' })
  const [errores, setErrores] = useState({})
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
    fetchUsuarios().then(setUsuarios)
  }, [])

  const cambiar = (campo) => (e) => {
    setDatos((actual) => ({ ...actual, [campo]: e.target.value }))
    setAlerta(null)
  }

  const enviar = (e) => {
    e.preventDefault()

    const nuevosErrores = {}
    if (!validarRequerido(datos.nombre)) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!validarRequerido(datos.usuario)) nuevosErrores.usuario = 'El usuario es obligatorio.'
    if (!validarRequerido(datos.password)) nuevosErrores.password = 'La contraseña es obligatoria.'
    if (!validarRequerido(datos.rol)) nuevosErrores.rol = 'Selecciona un rol.'
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const usuarioNormalizado = datos.usuario.trim().toLowerCase()
    const existe = usuarios.some(
      (u) => String(u.usuario).toLowerCase() === usuarioNormalizado,
    )

    if (existe) {
      setAlerta({
        tipo: 'warning',
        texto: (
          <>
            El usuario <strong>{datos.usuario}</strong> ya existe. Elige otro nombre de usuario.
          </>
        ),
      })
      return
    }

    const nuevos = [
      ...usuarios,
      {
        nombre: datos.nombre.trim(),
        usuario: usuarioNormalizado,
        rol: datos.rol,
        estado: 'Activo',
        password: datos.password,
      },
    ]
    setUsuarios(nuevos)
    guardarUsuarios(nuevos)
    setDatos({ 
      nombre: '', 
      usuario: '', 
      password: '', 
      rol: 'Vendedor' 
    })
    setAlerta({
      tipo: 'success',
      texto: (
        <>
          Usuario <strong>{datos.nombre}</strong> agregado correctamente como{' '}
          <strong>{datos.rol}</strong>.
        </>
      ),
    })
  }

  return (
    <section id="Personal" className="card shadow-sm border-0" aria-label="Personal y usuarios del sistema">
      <div className="card-header bg-dark text-white py-3">
        <h2 className="h5 fw-bold mb-0 text-white">
          <i className="bi bi-people-fill text-warning me-2" />Personal y Roles del Sistema
        </h2>
      </div>

      <div className="card-body">
        <div className="table-responsive mb-3">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody id="tablaUsuariosAdmin">
              {usuarios.map((usuario) => (
                <tr key={usuario.usuario}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.usuario}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <span className={`badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                      {usuario.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {alerta && <AlertaBootstrap tipo={alerta.tipo} onClose={() => setAlerta(null)}>{alerta.texto}</AlertaBootstrap>}

        <div className="bg-light p-3 rounded border">
          <h3 className="h6 fw-bold mb-2">Registrar Nuevo Empleado o Acceso</h3>
          <form id="formNuevoUsuario" className="row g-2 align-items-end" noValidate onSubmit={enviar}>
            <div className="col-12 col-md-4">
              <label htmlFor="nuevoNombre" className="form-label small">
                Nombre Completo <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${errores.nombre ? 'is-invalid' : ''}`}
                id="nuevoNombre"
                placeholder="Ej: Pedro Valdés"
                value={datos.nombre}
                onChange={cambiar('nombre')}
              />
              <div className="invalid-feedback">{errores.nombre}</div>
            </div>
            <div className="col-12 col-md-3">
              <label htmlFor="nuevoUsuario" className="form-label small">
                Usuario <span className="req">*</span>
              </label>
              <input
                type="text"
                className={`form-control form-control-sm ${errores.usuario ? 'is-invalid' : ''}`}
                id="nuevoUsuario"
                placeholder="Ej: pvaldes"
                value={datos.usuario}
                onChange={cambiar('usuario')}
              />
              <div className="invalid-feedback">{errores.usuario}</div>
            </div>
            <div className="col-12 col-md-3">
              <label htmlFor="nuevoPassword" className="form-label small">
                Contraseña <span className="req">*</span>
              </label>
              <input
                type="password"
                className={`form-control form-control-sm ${errores.password ? 'is-invalid' : ''}`}
                id="nuevoPassword"
                placeholder="Contraseña"
                value={datos.password}
                onChange={cambiar('password')}
              />
              <div className="invalid-feedback">{errores.password}</div>
            </div>
            <div className="col-12 col-md-3">
              <label htmlFor="nuevoRol" className="form-label small">
                Rol asignado <span className="req">*</span>
              </label>
              <select
                className={`form-select form-select-sm ${errores.rol ? 'is-invalid' : ''}`}
                id="nuevoRol"
                value={datos.rol}
                onChange={cambiar('rol')}
              >
                {ROLES_POSIBLES.map((rol) => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
              <div className="invalid-feedback">{errores.rol}</div>
            </div>
            <div className="col-12 col-md-2">
              <button type="submit" className="btn btn-sm btn-primary w-100 fw-bold">
                <i className="bi bi-plus-circle me-1" /> Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}