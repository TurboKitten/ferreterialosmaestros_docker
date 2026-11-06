import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ControlStockAdmin from './ControlStockAdmin'

const PRODUCTOS = [
  { codigo: 'FER-001', producto: 'Martillo Profesional', categoria: 'manuales', precio: 12990, stock: 15, minimo: 10 },
  { codigo: 'FER-003', producto: 'Taladro Eléctrico', categoria: 'electricas', precio: 49990, stock: 8, minimo: 10 },
]

beforeEach(() => {
  localStorage.setItem('admin_productos', JSON.stringify(PRODUCTOS))
})
afterEach(() => {
  localStorage.clear()
})

describe('ControlStockAdmin', () => {
  it('muestra el stock actual y el estado (normal / crítico) de cada producto', () => {
    render(<ControlStockAdmin />)
    expect(screen.getByText('Martillo Profesional')).toBeInTheDocument()
    expect(screen.getByText('Taladro Eléctrico')).toBeInTheDocument()
    //taladro (8 <= mínimo 10) es crítico; martillo (15 > 10) es normal.
    expect(screen.getAllByText('Stock crítico')).toHaveLength(1)
    expect(screen.getAllByText('Stock normal')).toHaveLength(1)
  })

  it('actualiza los KPIs de total de productos y de alertas de stock crítico', () => {
    const { container } = render(<ControlStockAdmin />)
    expect(container.querySelector('#kpiTotalProductos').textContent).toBe('2')
    expect(container.querySelector('#kpiStockCritico').textContent).toBe('1')
  })

  it('agrega unidades de stock y persiste el cambio', async () => {
    const user = userEvent.setup()
    const { container } = render(<ControlStockAdmin />)
    const input = container.querySelectorAll('input[type="number"]')[0]
    await user.clear(input)
    await user.type(input, '3')
    await user.click(container.querySelectorAll('[data-accion="agregar-stock"]')[0])
    expect(screen.getByText(/Se agregaron 3 unidades de Martillo Profesional/)).toBeInTheDocument()
    const productos = JSON.parse(localStorage.getItem('admin_productos'))
    expect(productos.find((p) => p.codigo === 'FER-001').stock).toBe(18)
  })

  it('quita unidades de stock y persiste el cambio', async () => {
    const user = userEvent.setup()
    const { container } = render(<ControlStockAdmin />)
    const input = container.querySelectorAll('input[type="number"]')[1]
    await user.clear(input)
    await user.type(input, '2')
    await user.click(container.querySelectorAll('[data-accion="quitar-stock"]')[1])
    expect(screen.getByText(/Se quitaron 2 unidades de Taladro Eléctrico/)).toBeInTheDocument()
    const productos = JSON.parse(localStorage.getItem('admin_productos'))
    expect(productos.find((p) => p.codigo === 'FER-003').stock).toBe(6)
  })

  it('rechaza cantidades inválidas y quitar más stock del disponible', async () => {
    const user = userEvent.setup()
    const { container } = render(<ControlStockAdmin />)
    await user.clear(container.querySelectorAll('input[type="number"]')[0])
    await user.type(container.querySelectorAll('input[type="number"]')[0], '0')
    await user.click(container.querySelectorAll('[data-accion="agregar-stock"]')[0])
    expect(screen.getByText('Ingresa una cantidad válida mayor que 0.')).toBeInTheDocument()
    await user.clear(container.querySelectorAll('input[type="number"]')[1])
    await user.type(container.querySelectorAll('input[type="number"]')[1], '99')
    await user.click(container.querySelectorAll('[data-accion="quitar-stock"]')[1])
    expect(
      screen.getByText(/No puedes quitar 99 unidades porque Taladro Eléctrico solo tiene 8/),
    ).toBeInTheDocument()
  })
})