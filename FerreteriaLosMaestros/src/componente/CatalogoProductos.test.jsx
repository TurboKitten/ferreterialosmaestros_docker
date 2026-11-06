import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import CatalogoProductos from './CatalogoProductos'

const PRODUCTOS = [
  { codigo: 'FER-001', producto: 'Martillo Profesional', categoria: 'manuales', precio: 12990, stock: 15, minimo: 10 },
  { codigo: 'FER-003', producto: 'Taladro Eléctrico', categoria: 'electricas', precio: 49990, stock: 2, minimo: 10 },
]

beforeEach(() => {
  localStorage.setItem('admin_productos', JSON.stringify(PRODUCTOS))
  localStorage.removeItem('carrito_invitado')
})
afterEach(() => {
  localStorage.clear()
})

describe('CatalogoProductos', () => {
  it('renderiza los productos del catálogo con su precio', () => {
    render(<CatalogoProductos />)
    expect(screen.getByText('Martillo Profesional')).toBeInTheDocument()
    expect(screen.getByText('Taladro Eléctrico')).toBeInTheDocument()
    expect(screen.getByText('$12.990')).toBeInTheDocument()
    expect(screen.getByText('$49.990')).toBeInTheDocument()
  })

  it('filtra los productos por categoría', async () => {
    const user = userEvent.setup()
    render(<CatalogoProductos />)
    await user.selectOptions(screen.getByLabelText(/Filtrar productos por categoría/), 'electricas')
    expect(screen.queryByText('Martillo Profesional')).not.toBeInTheDocument()
    expect(screen.getByText('Taladro Eléctrico')).toBeInTheDocument()
  })

  it('muestra un mensaje cuando la categoría seleccionada no tiene productos', async () => {
    const user = userEvent.setup()
    render(<CatalogoProductos />)
    await user.selectOptions(screen.getByLabelText(/Filtrar productos por categoría/), 'gasfiteria')
    expect(screen.getByText(/No hay productos en esta categoría por el momento/)).toBeInTheDocument()
  })

  it('agrega un producto al carrito y muestra la alerta de éxito', async () => {
    const user = userEvent.setup()
    render(<CatalogoProductos />)
    await user.click(screen.getAllByRole('button', { name: /Agregar al carrito/ })[0])
    expect(screen.getByText('Martillo Profesional fue agregado al carrito.')).toBeInTheDocument()
    const carrito = JSON.parse(localStorage.getItem('carrito_invitado'))
    expect(carrito).toHaveLength(1)
    expect(carrito[0]).toMatchObject({ codigo: 'FER-001', producto: 'Martillo Profesional', cantidad: 1 })
  })

  it('avisa cuando no queda stock para agregar más unidades', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'carrito_invitado',
      JSON.stringify([{ codigo: 'FER-003', producto: 'Taladro Eléctrico', precio: 49990, cantidad: 2 }]),
    )
    render(<CatalogoProductos />)
    await user.click(screen.getAllByRole('button', { name: /Agregar al carrito/ })[1])
    expect(screen.getByText(/No puedes agregar más unidades de Taladro Eléctrico/)).toBeInTheDocument()
  })
})