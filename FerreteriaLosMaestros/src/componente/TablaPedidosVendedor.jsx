import { useEffect, useState } from 'react'
import { cargarPedidos, fetchPedidos, guardarPedidos } from '../services/almacen'

const ESTADOS = [
  { valor: 'pendiente', label: 'Pendiente', clase: 'bg-warning text-dark' },
  { valor: 'preparacion', label: 'En Preparación', clase: 'bg-info text-dark' },
  { valor: 'entregado', label: 'Entregado', clase: 'bg-success' },
]

function estadoDe(valor) {
  return ESTADOS.find((e) => e.valor === valor) || { label: 'Desconocido', clase: 'bg-secondary' }
}

//control de estados de entrega de los pedidos (columna derecha del vendedor).
export default function TablaPedidosVendedor() {
  const [pedidos, setPedidos] = useState(() => cargarPedidos())

  useEffect(() => {
    fetchPedidos().then(setPedidos)
  }, [])

  const cambiarEstado = (folio, nuevoEstado) => {
    const nuevos = pedidos.map((pedido) =>
      String(pedido.folio) === String(folio) ? { ...pedido, estado: nuevoEstado } : pedido,
    )
    setPedidos(nuevos)
    guardarPedidos(nuevos)
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-dark text-white py-3">
        <h2 className="h5 fw-bold mb-0 text-white">
          <i className="bi bi-clock-history text-warning me-2" />Pedidos y Estados de Entrega
        </h2>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Folio / Cliente</th>
                <th>Estado</th>
                <th className="text-end">Cambiar a</th>
              </tr>
            </thead>
            <tbody id="tablaPedidos">
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-3">
                    Aún no hay pedidos registrados.
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.folio}>
                    <td>
                      <span className="fw-bold">#{pedido.folio}</span>
                      <br />
                      <small className="text-muted">{pedido.cliente || 'Venta de mesón'}</small>
                    </td>
                    <td>
                      <span className={`badge ${estadoDe(pedido.estado).clase}`}>
                        {estadoDe(pedido.estado).label}
                      </span>
                    </td>
                    <td className="text-end">
                      <select
                        className="form-select form-select-sm d-inline-block w-auto"
                        value={pedido.estado}
                        data-estado-pedido={pedido.folio}
                        onChange={(e) => cambiarEstado(pedido.folio, e.target.value)}
                      >
                        <option value="" disabled>Estado</option>
                        {ESTADOS.map((estado) => (
                          <option key={estado.valor} value={estado.valor}>
                            {estado.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-light small text-muted">
        * Cambia el selector para actualizar el estado del pedido.
      </div>
    </div>
  )
}