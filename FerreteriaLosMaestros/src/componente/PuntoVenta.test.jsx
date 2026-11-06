import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PuntoVenta from './PuntoVenta'

const PRODUCTOS = [
  { codigo: 'FER-001', producto: 'Martillo Profesional', categoria: 'manuales', precio: 12990, stock: 15, minimo: 10 },
  { codigo: 'FER-002', producto: 'Taladro Eléctrico', categoria: 'electricas', precio: 49990, stock: 2, minimo: 10 },
]

const agregarProducto = async (user, codigo, cantidad = '1') => {
  await user.selectOptions(screen.getByLabelText(/Seleccionar Producto/), codigo)
  const inputCantidad = screen.getByLabelText(/Cantidad/)
  await user.clear(inputCantidad)
  await user.type(inputCantidad, cantidad)
  await user.click(screen.getByRole('button', { name: /Agregar al Detalle de Venta/ }))
}

beforeEach(() => {
  localStorage.setItem('admin_productos', JSON.stringify(PRODUCTOS))
  localStorage.removeItem('admin_pedidos')
})
afterEach(() => {
  localStorage.clear()
})

describe('PuntoVenta', () => {
  it('calcula total bruto, neto e IVA al agregar un producto', async () => {
    const user = userEvent.setup()
    const { container } = render(<PuntoVenta />)

    await agregarProducto(user, 'FER-001')

    expect(screen.getByText('Martillo Profesional')).toBeInTheDocument()
    // 1 x $12.990 con IVA incluido -> neto $10.916 e IVA $2.074.
    expect(screen.getByText('$10.916')).toBeInTheDocument()
    expect(screen.getByText('$2.074')).toBeInTheDocument()
    expect(container.querySelector('#totalVenta').textContent).toBe('$12.990')
  })

  it('valida la selección de producto y la cantidad', async () => {
    const user = userEvent.setup()
    render(<PuntoVenta />)

    await user.click(screen.getByRole('button', { name: /Agregar al Detalle de Venta/ }))
    expect(screen.getByText(/Debes seleccionar un producto/)).toBeInTheDocument()

    await agregarProducto(user, 'FER-001', '0')
    expect(screen.getByText(/La cantidad debe ser un número entero mayor que 0/)).toBeInTheDocument()
  })

  it('no permite agregar más unidades del stock disponible', async () => {
    const user = userEvent.setup()
    render(<PuntoVenta />)
    await agregarProducto(user, 'FER-002', '3')
    expect(screen.getByText(/No hay suficiente stock. Disponible: 2 unidades/)).toBeInTheDocument()
    expect(screen.getByText(/Agrega productos para comenzar la venta/)).toBeInTheDocument()
  })

  it('aplica la tarifa de contratista (-15 %) y la recalcula al cambiar de tarifa', async () => {
    const user = userEvent.setup()
    const { container } = render(<PuntoVenta />)
    const selectTarifa = screen.getByLabelText(/Tipo de Tarifa/)
    await user.selectOptions(selectTarifa, 'contratista')
    await agregarProducto(user, 'FER-001')

    // 12.990 * 0.85 = 11.041,5 -> redondeado y formateado.
    expect(container.querySelector('#totalVenta').textContent).toBe('$11.042')
    await user.selectOptions(selectTarifa, 'general')
    expect(container.querySelector('#totalVenta').textContent).toBe('$12.990')
  })

  it('exige seleccionar un método de pago antes de cobrar', async () => {
    const user = userEvent.setup()
    render(<PuntoVenta />)
    await agregarProducto(user, 'FER-001')
    await user.click(screen.getByRole('button', { name: /Cobrar y Emitir Boleta/ }))
    expect(screen.getByText(/Debes seleccionar un método de pago/)).toBeInTheDocument()
    expect(localStorage.getItem('admin_pedidos')).toBeNull()
  })

  it('cobra la venta: descuenta stock, genera folio y persiste el pedido', async () => {
    const user = userEvent.setup()
    const { container } = render(<PuntoVenta />)

    await agregarProducto(user, 'FER-001', '2')
    await user.selectOptions(container.querySelector('#metodoPagoVenta'), 'Efectivo')
    await user.click(screen.getByRole('button', { name: /Cobrar y Emitir Boleta/ }))

    expect(screen.getByText(/Venta realizada correctamente/)).toBeInTheDocument()
    expect(screen.getByText(/Pedido #1001/)).toBeInTheDocument()

    const productos = JSON.parse(localStorage.getItem('admin_productos'))
    expect(productos.find((p) => p.codigo === 'FER-001').stock).toBe(13)

    const pedidos = JSON.parse(localStorage.getItem('admin_pedidos'))
    expect(pedidos).toHaveLength(1)
    expect(pedidos[0]).toMatchObject({ folio: 1001, metodoPago: 'Efectivo', origen: 'vendedor', total: 25980 })
  })
})