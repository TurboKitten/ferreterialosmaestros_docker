import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ListaMisPedidos from './ListaMisPedidos'

describe('ListaMisPedidos', () => {
  it('muestra el mensaje cuando no hay pedidos realizados', () => {
    render(<ListaMisPedidos pedidos={[]} />)
    expect(screen.getByText('No tienes pedidos realizados.')).toBeInTheDocument()
  })

  it('muestra la tabla de pedidos con folio, entrega, total, estado y pago', () => {
    const pedidos = [
      {
        folio: 1001,
        fecha: '2026-10-01',
        entrega: 'despacho',
        total: 25980,
        estado: 'entregado',
        metodoPago: 'cuenta_corriente',
      },
    ]
    render(<ListaMisPedidos pedidos={pedidos} />)

    expect(screen.getByText('1001')).toBeInTheDocument()
    expect(screen.getByText('2026-10-01')).toBeInTheDocument()
    expect(screen.getByText('Despacho')).toBeInTheDocument()
    expect(screen.getByText('$25.980')).toBeInTheDocument()
    expect(screen.getByText('entregado')).toBeInTheDocument()
    expect(screen.getByText('Cuenta corriente')).toBeInTheDocument()
  })
})