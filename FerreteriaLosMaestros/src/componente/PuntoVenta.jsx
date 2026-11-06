import { useEffect, useState } from 'react'
import AlertaBootstrap from './AlertaBootstrap'
import { cargarProductos, fetchProductos, guardarProductos } from '../services/almacen'
import { crearPedidoVendedor } from '../services/pedidos'
import { aplicarTarifa, calcularTotalesVenta, descontarStock, generarFolio } from '../utils/venta'
import { formatoPesos } from '../utils/formato'
import { cargarPedidos, fetchPedidos } from '../services/almacen'

const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'Transferencia']

//punto de venta de vendedor
export default function PuntoVenta() {
  const [productos, setProductos] = useState(() => cargarProductos())
  const [detalle, setDetalle] = useState([])
  const [codigoProducto, setCodigoProducto] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [tarifa, setTarifa] = useState('general')
  const [metodoPago, setMetodoPago] = useState('')
  const [alerta, setAlerta] = useState(null)

  useEffect(() => {
    fetchProductos().then(setProductos)
    fetchPedidos()
  }, [])

  const totales = calcularTotalesVenta(detalle)

  const agregar = (e) => {
    e.preventDefault()

    if (!codigoProducto) {
      setAlerta({ tipo: 'warning', texto: 'Debes seleccionar un producto.' })
      return
    }
    const cantidadNumero = Number(cantidad)
    if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
      setAlerta({ tipo: 'warning', texto: 'La cantidad debe ser un número entero mayor que 0.' })
      return
    }

    const producto = productos.find((p) => p.codigo === codigoProducto)
    if (!producto) {
      setAlerta({ tipo: 'danger', texto: 'No se encontró el producto seleccionado.' })
      return
    }
    if (Number(producto.stock) <= 0) {
      setAlerta({ tipo: 'danger', texto: 'Este producto no tiene stock disponible.' })
      return
    }

    const existente = detalle.find((item) => item.codigo === codigoProducto)
    const yaAgregada = existente ? existente.cantidad : 0
    if (yaAgregada + cantidadNumero > Number(producto.stock)) {
      setAlerta({
        tipo: 'danger',
        texto: `No hay suficiente stock. Disponible: ${producto.stock} unidades.`,
      })
      return
    }

    const precio = aplicarTarifa(producto.precio, tarifa)

    if (existente) {
      setDetalle((actual) =>
        actual.map((item) =>
          item.codigo === codigoProducto
            ? {
                ...item,
                cantidad: item.cantidad + cantidadNumero,
                subtotal: (item.cantidad + cantidadNumero) * item.precioUnitario,
              }
            : item,
        ),
      )
    } else {
      setDetalle((actual) => [
        ...actual,
        {
          codigo: producto.codigo,
          producto: producto.producto,
          cantidad: cantidadNumero,
          precioUnitario: precio,
          subtotal: cantidadNumero * precio,
        },
      ])
    }
    setCantidad(1)
    setAlerta(null)
  }

  const quitar = (indice) => {
    setDetalle((actual) => actual.filter((_, i) => i !== indice))
  }

  const cambiarTarifa = (nuevaTarifa) => {
    setTarifa(nuevaTarifa)
    setDetalle((actual) =>
      actual.map((item) => {
        const producto = productos.find((p) => p.codigo === item.codigo)
        if (!producto) return item
        const precio = aplicarTarifa(producto.precio, nuevaTarifa)
        return { ...item, precioUnitario: precio, subtotal: item.cantidad * precio }
      }),
    )
  }

  const cobrar = async () => {
    if (detalle.length === 0) {
      setAlerta({ tipo: 'warning', texto: 'No hay productos en la venta.' })
      return
    }
    if (!metodoPago) {
      setAlerta({ tipo: 'warning', texto: 'Debes seleccionar un método de pago.' })
      return
    }

    const resultado = descontarStock(productos, detalle)
    if (!resultado.ok) {
      setAlerta({ tipo: 'danger', texto: resultado.mensaje })
      return
    }

    const pedidos = cargarPedidos()
    const folio = generarFolio(pedidos)
    try {
      await crearPedidoVendedor({
        folio,
        detalle,
        tarifa,
        metodoPago,
        total: totales.bruto,
      })
    } catch (e) {
      setAlerta({ tipo: 'danger', texto: e.message || 'No se pudo registrar el pedido.' })
      return
    }

    setProductos(resultado.productos)
    guardarProductos(resultado.productos)
    setDetalle([])
    setMetodoPago('')
    setTarifa('general')
    setCantidad(1)
    setAlerta({
      tipo: 'success',
      texto: `Venta realizada correctamente. Pedido #${folio}. Total: ${formatoPesos(totales.bruto)}.`,
    })
  }

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-dark text-white py-3">
        <h2 className="h5 fw-bold mb-0 text-white">
          <i className="bi bi-receipt text-warning me-2" />Punto de Venta / Emisión de Boleta
        </h2>
      </div>

      <div className="card-body">
        {alerta && <AlertaBootstrap tipo={alerta.tipo} onClose={() => setAlerta(null)}>{alerta.texto}</AlertaBootstrap>}

        <form id="formVenta" className="row g-2 mb-3 align-items-end" onSubmit={agregar} noValidate>
          <div className="col-12 col-md-5">
            <label htmlFor="selectProductoVenta" className="form-label small">
              Seleccionar Producto <span className="req">*</span>
            </label>
            <select
              className="form-select form-select-sm"
              id="selectProductoVenta"
              value={codigoProducto}
              onChange={(e) => setCodigoProducto(e.target.value)}
            >
              <option value="">-- Seleccionar Producto --</option>
              {productos.map((producto) => (
                <option key={producto.codigo} value={producto.codigo} disabled={producto.stock <= 0}>
                  {producto.producto} - Stock: {producto.stock}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label htmlFor="cantidadVenta" className="form-label small">
              Cantidad <span className="req">*</span>
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              id="cantidadVenta"
              value={cantidad}
              min="1"
              max="99"
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="col-6 col-md-4">
            <label htmlFor="tarifaCliente" className="form-label small">
              Tipo de Tarifa
            </label>
            <select
              className="form-select form-select-sm"
              id="tarifaCliente"
              value={tarifa}
              onChange={(e) => cambiarTarifa(e.target.value)}
            >
              <option value="general">Público General</option>
              <option value="contratista">Contratista (-15%)</option>
            </select>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold">
              <i className="bi bi-plus-circle me-1" /> Agregar al Detalle de Venta
            </button>
          </div>
        </form>

        <div className="table-responsive border rounded mb-3">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Unitario</th>
                <th className="text-end">Subtotal</th>
                <th className="text-center">Quitar</th>
              </tr>
            </thead>
            <tbody id="detalleVenta">
              {detalle.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    Agrega productos para comenzar la venta.
                  </td>
                </tr>
              ) : (
                detalle.map((item, indice) => (
                  <tr key={`${item.codigo}-${indice}`}>
                    <td>{item.producto}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">{formatoPesos(item.precioUnitario)}</td>
                    <td className="text-end">{formatoPesos(item.subtotal)}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-1"
                        title="Quitar producto"
                        onClick={() => quitar(indice)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-light p-3 rounded border">
          <div className="d-flex justify-content-between mb-1 small text-muted">
            <span>Subtotal Neto:</span>
            <span id="subtotalNeto">{formatoPesos(totales.neto)}</span>
          </div>
          <div className="d-flex justify-content-between mb-1 small text-muted">
            <span>IVA (19%):</span>
            <span id="ivaVenta">{formatoPesos(totales.iva)}</span>
          </div>
          <div className="d-flex justify-content-between mb-3 fs-5 fw-bold text-dark border-top pt-1">
            <span>Total a Cobrar:</span>
            <span className="text-primary" id="totalVenta">{formatoPesos(totales.bruto)}</span>
          </div>

          <div className="row g-2 align-items-center">
            <div className="col-12 col-sm-6">
              <select
                className="form-select form-select-sm"
                id="metodoPagoVenta"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="" disabled>
                  Seleccionar método de pago
                </option>
                {METODOS_PAGO.map((metodo) => (
                  <option key={metodo} value={metodo}>
                    Pago: {metodo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <button type="button" id="btnCobrarVenta" className="btn btn-success btn-sm w-100 fw-bold" onClick={cobrar}>
                <i className="bi bi-printer me-1" /> Cobrar y Emitir Boleta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}