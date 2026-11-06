import { formatoPesos } from '../utils/formato'


export default function ProductoCard({ producto, onAgregar }) {
  const stock = Number(producto.stock) || 0
  const disponible = stock > 0

  return (
    <div className="card h-100 shadow-sm producto-card" data-codigo={producto.codigo}>
      {producto.imagen ? (
        <img src={producto.imagen} className="card-img-top" alt={producto.producto} />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center text-primary"
          style={{ minHeight: '150px', fontSize: '3rem' }}
        >
          <i className="bi bi-tools" aria-hidden="true" />
        </div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.producto}</h5>
        <p className="card-text mb-1">
          <strong>Precio:</strong> {formatoPesos(producto.precio)}
        </p>
        <p className="card-text">
          <strong>Stock:</strong>{' '}
          <span className={disponible ? 'text-success stock-producto' : 'text-danger stock-producto'}>
            {stock === 0
              ? 'Sin stock'
              : `${stock} ${stock === 1 ? 'unidad' : 'unidades'}`}
          </span>
        </p>
        <button
          type="button"
          className="btn btn-primary btn-sm w-100 mt-auto btn-agregar-carrito"
          data-codigo={producto.codigo}
          disabled={!disponible}
          onClick={() => onAgregar(producto.codigo)}
        >
          {disponible ? (
            <>
              <i className="bi bi-cart-plus me-1" /> Agregar al carrito
            </>
          ) : (
            <>
              <i className="bi bi-x-circle me-1" /> Sin stock
            </>
          )}
        </button>
      </div>
    </div>
  )
}