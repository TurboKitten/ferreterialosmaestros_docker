import { useEffect, useState } from 'react'
import ProductoCard from './ProductoCard'
import AlertaBootstrap from './AlertaBootstrap'
import { CATEGORIAS } from '../data/tienda'
import { agregarProducto } from '../utils/carrito'
import { cargarProductos, fetchProductos, cargarCarrito, guardarCarrito } from '../services/almacen'


export default function CatalogoProductos() {
  const [filtro, setFiltro] = useState('todos')
  const [productos, setProductos] = useState(() => cargarProductos())
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    fetchProductos().then(setProductos)
  }, [])

  const visibles =
    filtro === 'todos' ? productos : productos.filter((p) => p.categoria === filtro)

  const manejarAgregar = (codigo) => {
    const producto = productos.find((p) => p.codigo === codigo)
    if (!producto) {
      setMensaje({tipo: 'danger', texto: 'No se encontró el producto.'})
      return
    }

    const carrito = cargarCarrito()
    const nuevoCarrito = agregarProducto(carrito, producto)
    if (nuevoCarrito === carrito) {
      setMensaje({tipo: 'warning', texto: `No puedes agregar más unidades de ${producto.producto}: stock insuficiente.`})
      return
    }

    guardarCarrito(nuevoCarrito)
    setMensaje({tipo: 'success', texto: `${producto.producto} fue agregado al carrito.`})
  }

  return (
    <section id="catalogo" className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="h4 fw-bold mb-0">
            <i className="bi bi-grid-fill text-primary me-2" />Catálogo de Productos
          </h2>
          <small className="text-muted">Precios con IVA incluido. Consulta descuento especial para contratistas.</small>
        </div>

        <div className="mt-2 mt-md-0">
          <label htmlFor="filtroCategoria" className="visually-hidden">Filtrar por categoría</label>
          <select
            id="filtroCategoria"
            className="form-select"
            style={{ width: 'auto' }}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar productos por categoría"
          >
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.valor} value={categoria.valor}>
                {categoria.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mensaje && <AlertaBootstrap tipo={mensaje.tipo} onClose={() => setMensaje(null)}>{mensaje.texto}</AlertaBootstrap>}

      {visibles.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-box-seam display-4 d-block mb-2" />
          No hay productos en esta categoría por el momento.
        </div>
      ) : (
        <div className="row g-4" id="listaProductos">
          {visibles.map((producto) => (
            <div key={producto.codigo} className="col-12 col-sm-6 col-lg-3">
              <ProductoCard producto={producto} onAgregar={manejarAgregar} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}