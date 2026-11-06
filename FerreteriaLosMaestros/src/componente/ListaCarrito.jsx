import { formatoPesos } from '../utils/formato'


export default function ListaCarrito({ items, onSumar, onRestar, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th />
          </tr>
        </thead>
        <tbody id="tablaCarrito">
          {items.map((item, indice) => (
            <tr key={item.codigo}>
              <td>
                <strong>{item.producto}</strong>
                <br />
                <small className="text-muted">{item.codigo}</small>
              </td>
              <td>{item.codigo}</td>
              <td>{formatoPesos(item.precio)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    data-accion="restar"
                    data-indice={indice}
                    aria-label={`Quitar una unidad de ${item.producto}`}
                    onClick={() => onRestar(item.codigo)}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    data-accion="sumar"
                    data-indice={indice}
                    aria-label={`Agregar una unidad de ${item.producto}`}
                    onClick={() => onSumar(item.codigo)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{formatoPesos(item.precio * item.cantidad)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  data-accion="eliminar"
                  data-indice={indice}
                  aria-label={`Eliminar ${item.producto} del carrito`}
                  onClick={() => onEliminar(item.codigo)}
                >
                  <i className="bi bi-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}