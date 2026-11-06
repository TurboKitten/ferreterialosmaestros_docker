import { useState } from 'react'
import { formatoPesos } from '../utils/formato'


export default function ConfirmarPedido({ totales, esContratista, tieneCuentaCorriente, onConfirmar }) {
  const [entrega, setEntrega] = useState('retiro')
  const [direccionDespacho, setDireccionDespacho] = useState('')
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [usarCuentaCorriente, setUsarCuentaCorriente] = useState(false)

  const confirmar = () => {
    onConfirmar({ entrega, direccionDespacho, metodoPago, usarCuentaCorriente })
  }

  return (
    <section id="seccionConfirmacion" className="container pb-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-bold mb-4">Confirmar pedido</h2>

          <h3 className="h6 fw-bold">Forma de entrega</h3>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="tipoEntrega"
              id="retiroTienda"
              value="retiro"
              checked={entrega === 'retiro'}
              onChange={(e) => setEntrega(e.target.value)}
            />
            <label className="form-check-label" htmlFor="retiroTienda">Retiro en tienda</label>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="radio"
              name="tipoEntrega"
              id="despachoDomicilio"
              value="despacho"
              checked={entrega === 'despacho'}
              onChange={(e) => setEntrega(e.target.value)}
            />
            <label className="form-check-label" htmlFor="despachoDomicilio">Despacho a domicilio</label>
          </div>

          {entrega === 'despacho' && (
            <div className="mb-3">
              <label htmlFor="direccionDespacho" className="form-label">Dirección de despacho</label>
              <input
                type="text"
                className="form-control"
                id="direccionDespacho"
                value={direccionDespacho}
                onChange={(e) => setDireccionDespacho(e.target.value)}
                placeholder="Ingrese su dirección"
              />
            </div>
          )}

          <h3 className="h6 fw-bold">Forma de pago</h3>
          <select
            id="metodoPagoCarrito"
            className="form-select mb-3"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
          </select>

          {tieneCuentaCorriente && (
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="usarCuentaCorriente"
                checked={usarCuentaCorriente}
                onChange={(e) => setUsarCuentaCorriente(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="usarCuentaCorriente">Pagar mediante cuenta corriente</label>
            </div>
          )}

          <hr />
          <div className="d-flex justify-content-between">
            <span>Subtotal:</span>
            <strong>{formatoPesos(totales.subtotal)}</strong>
          </div>
          {esContratista && (
            <div className="d-flex justify-content-between">
              <span>Descuento contratista:</span>
              <strong>{formatoPesos(totales.descuento)}</strong>
            </div>
          )}
          <div className="d-flex justify-content-between fs-5 mt-2">
            <strong>Total:</strong>
            <strong>{formatoPesos(totales.total)}</strong>
          </div>
          <button type="button" className="btn btn-success w-100 mt-4" onClick={confirmar}>
            <i className="bi bi-check-circle me-1" /> Confirmar pedido
          </button>
        </div>
      </div>
    </section>
  )
}