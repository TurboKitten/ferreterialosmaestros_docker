import { formatoPesos } from '../utils/formato'

const ESTADO_CLASES = {
  pendiente: 'bg-warning text-dark',
  preparacion: 'bg-info text-dark',
  entregado: 'bg-success',
}

//lista de pedidos del cliente actual, filtrados por usuario.
export default function ListaMisPedidos({ pedidos }) {
  if (pedidos.length === 0) {
    return (
      <div className="card-body">
        <div id="sinPedidos" className="text-muted">
          No tienes pedidos realizados.
        </div>
      </div>
    )
  }

  return (
    <div id="contenedorMisPedidos" className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Fecha</th>
            <th>Entrega</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody id="tablaMisPedidos">
          {pedidos.map((pedido) => (
            <tr key={pedido.folio}>
              <td><strong>{pedido.folio}</strong></td>
              <td>{pedido.fecha}</td>
              <td>{pedido.entrega === 'despacho' ? 'Despacho' : 'Retiro en tienda'}</td>
              <td>{formatoPesos(pedido.total)}</td>
              <td>
                <span className={`badge ${ESTADO_CLASES[pedido.estado] || 'bg-secondary'}`}>
                  {pedido.estado}
                </span>
              </td>
              <td>
                <span className="badge bg-secondary">
                  {pedido.metodoPago === 'cuenta_corriente' ? 'Cuenta corriente' : pedido.metodoPago}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}