import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import ListaCarrito from '../../componente/ListaCarrito'
import ResumenCarrito from '../../componente/ResumenCarrito'
import ConfirmarPedido from '../../componente/ConfirmarPedido'
import ListaMisPedidos from '../../componente/ListaMisPedidos'
import AlertaBootstrap from '../../componente/AlertaBootstrap'

import {
  cargarCarrito,
  cargarPedidos,
  cargarProductos,
  cargarUsuarios,
  fetchPedidos,
  fetchProductos,
  fetchUsuarios,
  guardarCarrito,
  guardarProductos,
  obtenerSesion,
} from '../../services/almacen'
import { crearPedidoCarrito } from '../../services/pedidos'
import { calcularTotales, cambiarCantidad, eliminarProducto } from '../../utils/carrito'

//pagina mi carrito
export default function Carrito() {
  const navigate = useNavigate()
  const [items, setItems] = useState(() => cargarCarrito())
  const [sesion] = useState(() => obtenerSesion())
  const [confirmando, setConfirmando] = useState(false)
  const [alerta, setAlerta] = useState(null)
  const [, setVersion] = useState(0)

  useEffect(() => {
    Promise.all([fetchProductos(), fetchPedidos(), fetchUsuarios()]).then(() => setVersion((v) => v + 1))
  }, [])

  const esContratista = Boolean(sesion && sesion.rol === 'Contratista')

  const tieneCuentaCorriente = () => {
    if (!sesion) return false
    const usuarios = cargarUsuarios()
    const usuario = usuarios.find((u) => u.usuario === sesion.usuario)
    return Boolean(usuario && usuario.cuentaCorriente === true)
  }

  const totales = calcularTotales(items, esContratista)

  const guardarYRefrescar = (nuevos) => {
    guardarCarrito(nuevos)
    setItems(nuevos)
  }

  const sumar = (codigo) => {
    const producto = cargarProductos().find((p) => p.codigo === codigo)
    const stock = producto ? Number(producto.stock) : 0
    const actual = items.find((i) => i.codigo === codigo)
    if (actual && actual.cantidad >= stock) {
      setAlerta({ tipo: 'warning', texto: 'No puedes superar el stock disponible.' })
      return
    }
    guardarYRefrescar(cambiarCantidad(items, codigo, (actual ? actual.cantidad : 0) + 1, stock))
  }

  const restar = (codigo) => {
    const actual = items.find((i) => i.codigo === codigo)
    const nuevaCantidad = (actual ? actual.cantidad : 0) - 1
    guardarYRefrescar(cambiarCantidad(items, codigo, nuevaCantidad, 0))
  }

  const eliminar = (codigo) => {
    guardarYRefrescar(eliminarProducto(items, codigo))
  }

  const confirmarPedido = async (opciones) => {
    if (items.length === 0) {
      setAlerta({ tipo: 'warning', texto: 'El carrito está vacío.' })
      return
    }
    if (!sesion) {
      setAlerta({ tipo: 'warning', texto: 'Debes iniciar sesión para realizar un pedido.' })
      navigate('/login')
      return
    }
    if (opciones.entrega === 'despacho' && opciones.direccionDespacho.trim() === '') {
      setAlerta({ tipo: 'warning', texto: 'Ingresa una dirección de despacho.' })
      return
    }

    const productos = cargarProductos()
    for (const item of items) {
      const producto = productos.find((p) => p.codigo === item.codigo)
      if (!producto || Number(producto.stock) < item.cantidad) {
        setAlerta({ tipo: 'danger', texto: `No hay suficiente stock de: ${item.producto}` })
        return
      }
    }

    //descontar stock (local/cache; persistencia en API se puede agregar después)
    const nuevosProductos = productos.map((producto) => {
      const vendido = items.filter((i) => i.codigo === producto.codigo).reduce((total, i) => total + Number(i.cantidad), 0)
      return vendido > 0 ? { ...producto, stock: producto.stock - vendido } : producto
    })
    guardarProductos(nuevosProductos)

    try {
      const pedido = await crearPedidoCarrito({
        carrito: items,
        sesion,
        entrega: opciones.entrega,
        direccionDespacho: opciones.direccionDespacho,
        metodoPago: opciones.metodoPago,
        totales,
        usarCuentaCorriente: opciones.usarCuentaCorriente,
        tieneCuentaCorriente: tieneCuentaCorriente(),
      })
      guardarYRefrescar([])
      setConfirmando(false)
      fetchPedidos().then(() => setVersion((v) => v + 1))
      setAlerta({ tipo: 'success', texto: `Pedido realizado correctamente.\nNúmero de pedido: ${pedido.folio}` })
    } catch (e) {
      setAlerta({ tipo: 'danger', texto: e.message || 'No se pudo realizar el pedido.' })
    }
  }

  const misPedidos = sesion
    ? cargarPedidos().filter((pedido) => pedido.usuario === sesion.usuario)
    : []

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1">
            <i className="bi bi-cart3 me-2" />Mi carrito
          </h1>
          <p className="text-muted mb-0">Revisa tus productos antes de confirmar el pedido.</p>
        </div>
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-1" /> Seguir comprando
        </Link>
      </div>

      {alerta && <AlertaBootstrap tipo={alerta.tipo} onClose={() => setAlerta(null)}>{alerta.texto}</AlertaBootstrap>}

      <div className="card shadow-sm">
        <div className="card-body">
          {items.length === 0 && !confirmando ? (
            <div id="carritoVacio" className="text-center py-5">
              <i className="bi bi-cart-x display-1 text-muted" />
              <h3 className="mt-3">Tu carrito está vacío</h3>
              <p className="text-muted">Agrega productos desde nuestro catálogo para comenzar tu pedido.</p>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-shop me-1" /> Ir al catálogo
              </Link>
            </div>
          ) : (
            <div id="contenidoCarrito">
              <ListaCarrito items={items} onSumar={sumar} onRestar={restar} onEliminar={eliminar} />

              {!confirmando ? (
                <div className="row justify-content-end mt-4">
                  <ResumenCarrito
                    totales={totales}
                    esContratista={esContratista}
                    onContinuar={() => {
                      if (!sesion) {
                        setAlerta({ tipo: 'warning', texto: 'Debes iniciar sesión para continuar con el pedido.' })
                        navigate('/login')
                        return
                      }
                      setConfirmando(true)
                    }}
                  />
                </div>
              ) : (
                <div className="row justify-content-center mt-4">
                  <div className="col-12 col-lg-7">
                    <ConfirmarPedido
                      totales={totales}
                      esContratista={esContratista}
                      tieneCuentaCorriente={tieneCuentaCorriente()}
                      onConfirmar={confirmarPedido}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="container pb-5 mt-4 px-0">
        <div className="card shadow-sm">
          <div className="card-header">
            <h2 className="h5 fw-bold mb-0">
              <i className="bi bi-receipt me-2" />Mis pedidos
            </h2>
          </div>
          {sesion ? (
            <ListaMisPedidos pedidos={misPedidos} />
          ) : (
            <div className="card-body">
              <div className="text-muted">Inicia sesión para ver tus pedidos.</div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}