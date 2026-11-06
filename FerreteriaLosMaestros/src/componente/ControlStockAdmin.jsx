import { useEffect, useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { cargarProductos, fetchProductos, guardarProductos } from '../services/almacen'

//control de inventario y stock critico
export default function ControlStockAdmin() {
  const [productos, setProductos] = useState(() => cargarProductos())
  const [cantidades, setCantidades] = useState({})
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
    fetchProductos().then(setProductos)
  }, [])

  const critico = (producto) => Number(producto.stock) <= Number(producto.minimo || 0)
  const stockCritico = productos.filter(critico).length

  const cambiarCantidadInput = (codigo) => (e) => {
    setCantidades((actual) => ({ ...actual, [codigo]: e.target.value }))
  }

  const modificarStock = (producto, agregar) => {
    const cantidad = Number(cantidades[producto.codigo] || 1)

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setAlerta({
        tipo: 'danger',
        texto: 'Ingresa una cantidad válida mayor que 0.',
      })
      return
    }
    if (!agregar && cantidad > producto.stock) {
      setAlerta({
        tipo: 'danger',
        texto: `No puedes quitar ${cantidad} unidades porque ${producto.producto} solo tiene ${producto.stock}.`,
      })
      return
    }

    const nuevos = productos.map((p) => {
      if (p.codigo !== producto.codigo) return p
      const stock = agregar ? Number(p.stock) + cantidad : Number(p.stock) - cantidad
      return { ...p, stock }
    })

    setProductos(nuevos)
    guardarProductos(nuevos)
    setCantidades((actual) => ({ ...actual, [producto.codigo]: 1 }))
    setAlerta({
      tipo: agregar ? 'success' : 'warning',
      texto: `Se ${agregar ? 'agregaron' : 'quitaron'} ${cantidad} unidades de ${producto.producto}.`,
    })
  }

  return (
    <section id="Inventario" className="card shadow-sm border-0 mb-4" aria-label="Inventario y stock crítico">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <h2 className="h5 fw-bold mb-0 text-white">
          <i className="bi bi-exclamation-triangle-fill text-warning me-2" />Inventario y Stock Crítico
        </h2>
        <span className="badge bg-secondary">Bodega Central</span>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 table-custom">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="text-center">Stock Actual</th>
                <th className="text-center">Stock Mínimo</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody id="tablaStockAdmin">
              {productos.map((producto) => (
                <tr key={producto.codigo}>
                  <td><strong>{producto.codigo}</strong></td>
                  <td>{producto.producto}</td>
                  <td>{producto.categoria}</td>
                  <td className="text-center fw-bold">{producto.stock}</td>
                  <td className="text-center">{producto.minimo}</td>
                  <td className="text-center">
                    <span className={`badge ${critico(producto) ? 'bg-danger' : 'bg-success'}`}>
                      {critico(producto) ? 'Stock crítico' : 'Stock normal'}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-1 justify-content-center">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        value={cantidades[producto.codigo] ?? 1}
                        onChange={cambiarCantidadInput(producto.codigo)}
                        style={{ width: '75px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success fw-bold"
                        data-accion="agregar-stock"
                        title="Agregar unidades"
                        onClick={() => modificarStock(producto, true)}
                      >
                        <i className="bi bi-plus-lg" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger fw-bold"
                        data-accion="quitar-stock"
                        title="Quitar unidades"
                        onClick={() => modificarStock(producto, false)}
                      >
                        <i className="bi bi-dash-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-light small text-muted">
        Ajusta la cantidad de producto y luego presiona <strong>"+"</strong> o <strong>"-"</strong> para
        simular el ingreso o retiro de mercadería a bodega.
      </div>

      {/*resumen (KPIs)*/}
      <div className="card-body row g-3 mt-0">
        <div className="col-12 col-md-4">
          <div className="kpi-card shadow-sm border-start border-primary border-4">
            <div className="text-muted small fw-bold">TOTAL PRODUCTOS EN BODEGA</div>
            <div className="kpi-numero text-primary" id="kpiTotalProductos">{productos.length}</div>
            <small className="text-muted">Artículos registrados en sistema</small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="kpi-card shadow-sm border-start border-danger border-4">
            <div className="text-muted small fw-bold">ALERTAS DE STOCK CRÍTICO</div>
            <div className="kpi-numero text-danger" id="kpiStockCritico">{stockCritico}</div>
            <small className="text-danger fw-semibold">Requieren reposición urgente</small>
          </div>
        </div>
      </div>

      {alerta && (
        <div className="card-body pt-0">
          <AlertaBootstrap tipo={alerta.tipo} onClose={() => setAlerta(null)}>{alerta.texto}</AlertaBootstrap>
        </div>
      )}
    </section>
  )
}