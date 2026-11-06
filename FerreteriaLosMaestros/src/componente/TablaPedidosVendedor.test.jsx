import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TablaPedidosVendedor from './TablaPedidosVendedor'

const PEDIDOS = [{ folio: 1001, cliente: 'Matías Duncker', estado: 'pendiente', total: 25980 }]

beforeEach(() => {
  localStorage.setItem('admin_pedidos', JSON.stringify(PEDIDOS))
})
afterEach(() => {
  localStorage.clear()
})

describe('TablaPedidosVendedor', () => {
  it('muestra el estado vacío cuando no hay pedidos', () => {
    localStorage.setItem('admin_pedidos', '[]')
    render(<TablaPedidosVendedor />)
    expect(screen.getByText(/Aún no hay pedidos registrados/)).toBeInTheDocument()
  })

  it('cambia el estado del pedido y lo persiste', async () => {
    const user = userEvent.setup()
    const { container } = render(<TablaPedidosVendedor />)

    // "Pendiente" aparece en el badge (`span`) y también en el selector.
    expect(screen.getByText('Pendiente', { selector: 'span' })).toBeInTheDocument()
    await user.selectOptions(container.querySelector('[data-estado-pedido="1001"]'), 'entregado')
    expect(screen.getByText('Entregado', { selector: 'span' })).toBeInTheDocument()
    const pedidos = JSON.parse(localStorage.getItem('admin_pedidos'))
    expect(pedidos[0].estado).toBe('entregado')
  })
})