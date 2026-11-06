import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ResumenCarrito from './ResumenCarrito'

const TOTALES = { subtotal: 12990, descuento: 1948.5, total: 11041.5 }

describe('ResumenCarrito', () => {
  it('muestra subtotal, descuento y total', () => {
    const { container } = render(<ResumenCarrito totales={TOTALES} esContratista onContinuar={() => {}} />)
    expect(container.querySelector('#subtotalCarrito').textContent).toBe('$12.990')
    expect(container.querySelector('#descuentoCarrito').textContent).toBe('$1.949')
    expect(container.querySelector('#totalCarrito').textContent).toBe('$11.042')
  })

  it('oculta la fila de descuento para clientes sin tarifa contratista', () => {
    const { container } = render(<ResumenCarrito totales={TOTALES} esContratista={false} onContinuar={() => {}} />)
    expect(container.querySelector('#descuentoCarritoFila').className).toContain('d-none')
  })

  it('invoca onContinuar al presionar el botón de continuar', async () => {
    const user = userEvent.setup()
    const onContinuar = vi.fn()
    render(<ResumenCarrito totales={TOTALES} esContratista onContinuar={onContinuar} />)
    await user.click(screen.getByRole('button', { name: /Continuar con el pedido/ }))
    expect(onContinuar).toHaveBeenCalledTimes(1)
  })
})