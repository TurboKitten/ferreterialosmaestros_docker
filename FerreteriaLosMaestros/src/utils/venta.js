import { IVA } from '../data/tienda'

//aplica tarifas
export function aplicarTarifa(precio, tipoTarifa) {
  const valor = Number(precio) || 0
  return tipoTarifa === 'contratista' ? valor * 0.85 : valor
}

//calculo
export function calcularSubtotalDetalle(detalle = []) {
  return detalle.reduce(
    (total, item) =>
      total +
      (Number(item.subtotal) ||
        (Number(item.precioUnitario) || 0) * (Number(item.cantidad) || 0)),
    0,
  )
}

//desglose
export function calcularTotalesVenta(detalle = []) {
  const bruto = Math.round(calcularSubtotalDetalle(detalle))
  const neto = Math.round(bruto / (1 + IVA))
  const iva = bruto - neto
  return { bruto, neto, iva }
}

//generacion de folio
export function generarFolio(pedidos = []) {
  const ultimo = pedidos.reduce((mayor, pedido) => {
    const numero = Number(pedido.folio) || 0
    return numero > mayor ? numero : mayor
  }, 1000)
  return ultimo + 1
}

//validacion y actualizacion de stock y arreglo de productos
export function descontarStock(productos, detalle) {
  for (const item of detalle) {
    const producto = productos.find((p) => p.codigo === item.codigo)
    if (!producto) {
      return { ok: false, productos, mensaje: `El producto ${item.producto} ya no existe.` }
    }
    if (item.cantidad > producto.stock) {
      return { ok: false, productos, mensaje: `No hay suficiente stock de ${item.producto}.` }
    }
  }

  const nuevos = productos.map((producto) => {
    const vendido = detalle
      .filter((item) => item.codigo === producto.codigo)
      .reduce((total, item) => total + Number(item.cantidad) || 0, 0)
    return vendido > 0 ? { ...producto, stock: producto.stock - vendido } : producto
  })

  return { ok: true, productos: nuevos, mensaje: null }
}