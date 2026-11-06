import { api } from './api'
import { cargarPedidos, guardarPedidos, fetchPedidos } from './almacen'

export async function crearPedidoCarrito({
  carrito,
  sesion,
  entrega = 'retiro',
  direccionDespacho = '',
  metodoPago = 'tarjeta',
  totales = { subtotal: 0, descuento: 0, total: 0 },
  usarCuentaCorriente = false,
  tieneCuentaCorriente = false,
}) {
  const esDespacho = entrega === 'despacho'
  const pagoCuentaCorriente = tieneCuentaCorriente && usarCuentaCorriente

  const pedido = {
    folio: 'PED-' + Date.now(),
    cliente: sesion.nombre,
    usuario: sesion.usuario,
    rol: sesion.rol,
    productos: carrito.map((item) => ({
      codigo: item.codigo,
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      subtotal: item.precio * item.cantidad,
    })),
    subtotal: totales.subtotal,
    descuento: totales.descuento,
    total: totales.total,
    entrega: esDespacho ? 'despacho' : 'retiro',
    direccionDespacho: esDespacho ? direccionDespacho.trim() : '',
    metodoPago: pagoCuentaCorriente ? 'cuenta_corriente' : metodoPago,
    estadoPago: pagoCuentaCorriente ? 'pendiente_fin_mes' : 'pagado',
    estado: 'pendiente',
    fecha: new Date().toLocaleString('es-CL'),
    origen: 'carrito',
  }

  try {
    const creado = await api.post('/v1/pedidos', pedido)
    const normalizado = { ...pedido, ...creado }
    const pedidos = cargarPedidos()
    pedidos.unshift(normalizado)
    guardarPedidos(pedidos)
    return normalizado
  } catch (e) {
    console.warn('No se pudo crear pedido en API, guardando localmente', e)
    const pedidos = cargarPedidos()
    pedidos.push(pedido)
    guardarPedidos(pedidos)
    return pedido
  }
}

export async function crearPedidoVendedor({
  folio,
  detalle,
  tarifa = 'general',
  metodoPago = '',
  total = 0,
}) {
  const pedido = {
    folio,
    cliente: '',
    estado: 'entregado',
    tipoTarifa: tarifa,
    metodoPago,
    total: Math.round(total),
    productos: detalle.map((item) => ({
      codigo: item.codigo,
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: Math.round(item.precioUnitario),
      subtotal: Math.round(item.subtotal),
    })),
    fecha: new Date().toISOString(),
    origen: 'vendedor',
  }

  try {
    const creado = await api.post('/v1/pedidos', pedido)
    const normalizado = { ...pedido, ...creado }
    const pedidos = cargarPedidos()
    pedidos.unshift(normalizado)
    guardarPedidos(pedidos)
    return normalizado
  } catch (e) {
    console.warn('No se pudo crear pedido en API, guardando localmente', e)
    const pedidos = cargarPedidos()
    pedidos.push(pedido)
    guardarPedidos(pedidos)
    return pedido
  }
}

export { fetchPedidos }
