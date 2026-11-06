import { DESCUENTO_CONTRATISTA } from '../data/tienda'

export function agregarProducto(carrito, producto, cantidad = 1) {
  const stock = Number(producto.stock) || 0
  if (stock <= 0) {
    return carrito
  }

  const existente = carrito.find((item) => item.codigo === producto.codigo)
  const cantidadBase = existente ? existente.cantidad : 0
  if (cantidadBase + cantidad > stock) {
    return carrito
  }

  if (existente) {
    return carrito.map((item) =>
      item.codigo === producto.codigo
        ? { ...item, cantidad: item.cantidad + cantidad }
        : item,
    )
  }

  return [
    ...carrito,
    {
      codigo: producto.codigo,
      producto: producto.producto,
      precio: Number(producto.precio) || 0,
      cantidad,
    },
  ]
}


export function cambiarCantidad(carrito, codigo, cantidad, stock) {
  return carrito
    .map((item) => {
      if (item.codigo !== codigo) {
        return item
      }
      const nueva = Number(cantidad)

      if (nueva <= 0) {
        return null
      }

      const maximo = Number(stock) || 0
      if (maximo > 0 && nueva > maximo) {
        return item
      }
      return { ...item, cantidad: nueva }
    })
    .filter(Boolean)
}


export function eliminarProducto(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo)
}


export function calcularTotales(carrito, esContratista = false) {
  const subtotal = (carrito || []).reduce(
    (total, item) => total + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
    0,
  )
  const descuento = esContratista ? subtotal * DESCUENTO_CONTRATISTA : 0
  return {
    subtotal: Math.round(subtotal),
    descuento: Math.round(descuento),
    total: Math.round(subtotal - descuento),
  }
}