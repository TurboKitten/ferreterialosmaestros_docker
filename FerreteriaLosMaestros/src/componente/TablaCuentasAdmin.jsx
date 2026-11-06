import { useEffect, useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { cargarCuentas, fetchCuentas, guardarCuentas } from '../services/almacen'
import { formatoPesos } from '../utils/formato'

const ABONO = 500000

//cuentas corrientes
export default function TablaCuentasAdmin() {
  const [cuentas, setCuentas] = useState(() => cargarCuentas())
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
    fetchCuentas().then(setCuentas)
  }, [])

  const abonar = (cuenta) => {
    const abono = Math.min(ABONO, Number(cuenta.deuda) || 0)
    const nuevas = cuentas.map((c) =>
      c.rut === cuenta.rut ? { ...c, deuda: Math.max(0, Number(c.deuda) - abono) } : c,
    )
    setCuentas(nuevas)
    guardarCuentas(nuevas)
    setAlerta({
      tipo: 'success',
      texto: (
        <>
          Abono registrado para <strong>{cuenta.empresa}</strong>: {formatoPesos(abono)}.
          Deuda restante: <strong>{formatoPesos(Number(cuenta.deuda) - abono)}</strong>.
        </>
      ),
    })
  }

  return (
    <section id="CuentasCorrientes" className="card shadow-sm border-0 mb-4" aria-label="Cuentas corrientes de contratistas">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <h2 className="h5 fw-bold mb-0 text-white">
          <i className="bi bi-cash-coin text-warning me-2" />Cuentas Corrientes de Contratistas
        </h2>
        <span className="badge bg-info text-dark">Crédito a 30 días</span>
      </div>

      {alerta && (
        <div className="card-body pb-0">
          <AlertaBootstrap tipo={alerta.tipo} onClose={() => setAlerta(null)}>{alerta.texto}</AlertaBootstrap>
        </div>
      )}

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 table-custom">
            <thead>
              <tr>
                <th>Empresa Contratista</th>
                <th>RUT</th>
                <th className="text-end">Línea de Crédito</th>
                <th className="text-end">Deuda Actual</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody id="tablaCuentasAdmin">
              {cuentas.map((cuenta) => {
                const sobreLimite = Number(cuenta.deuda) >= Number(cuenta.credito)
                return (
                  <tr key={cuenta.rut}>
                    <td><strong>{cuenta.empresa}</strong></td>
                    <td>{cuenta.rut}</td>
                    <td className="text-end">{formatoPesos(cuenta.credito)}</td>
                    <td className="text-end">{formatoPesos(cuenta.deuda)}</td>
                    <td className="text-center">
                      <span className={`badge ${sobreLimite ? 'bg-danger' : 'bg-success'}`}>
                        {sobreLimite ? 'Crédito agotado' : 'Cuenta activa'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success fw-bold"
                        data-accion="abonar"
                        onClick={() => abonar(cuenta)}
                      >
                        <i className="bi bi-cash-coin me-1" /> Abonar $500.000
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-light small text-muted">
        Presiona <strong>"Abonar $500.000"</strong> para registrar un pago a la cuenta corriente del contratista.
      </div>
    </section>
  )
}