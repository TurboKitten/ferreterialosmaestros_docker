import { formatoPesos } from '../utils/formato'


export default function ResumenCarrito({ totales, esContratista, onContinuar }) {
  return (
    <div className="col-md-5 col-lg-4">
      <div className="card bg-light">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Resumen del pedido</h5>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span id="subtotalCarrito">{formatoPesos(totales.subtotal)}</span>
          </div>
          <div className={`d-flex justify-content-between mb-2 ${esContratista ? '' : 'd-none'}`} id="descuentoCarritoFila">
            <span>Descuento:</span>
            <span id="descuentoCarrito">{formatoPesos(totales.descuento)}</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <strong>Total:</strong>
            <strong id="totalCarrito">{formatoPesos(totales.total)}</strong>
          </div>
          <button type="button" id="btnContinuarCompra" className="btn btn-success w-100 mt-4" onClick={onContinuar}>
            <i className="bi bi-check-circle me-1" /> Continuar con el pedido
          </button>
        </div>
      </div>
    </div>
  )
}