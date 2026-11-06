import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ConfirmarPedido from './ConfirmarPedido'

const TOTALES = { subtotal: 10000, descuento: 1500, total: 8500 }

describe('ConfirmarPedido', () => {
  it('confirma con retiro en tienda y tarjeta por defecto', async () => {
    const onConfirmar = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmarPedido totales={TOTALES} esContratista={false} tieneCuentaCorriente={false} onConfirmar={onConfirmar} />,
    )

    await user.click(screen.getByRole('button', { name: /Confirmar pedido/ }))
    expect(onConfirmar).toHaveBeenCalledWith({
      entrega: 'retiro',
      direccionDespacho: '',
      metodoPago: 'tarjeta',
      usarCuentaCorriente: false,
    })
  })

  it('muestra los totales y el descuento de contratista', () => {
    render(
      <ConfirmarPedido totales={TOTALES} esContratista tieneCuentaCorriente={false} onConfirmar={() => {}} />,
    )
    expect(screen.getByText('$10.000')).toBeInTheDocument()
    expect(screen.getByText('$1.500')).toBeInTheDocument()
    expect(screen.getByText('$8.500')).toBeInTheDocument()
  })

  it('captura la dirección y la cuenta corriente al confirmar con despacho', async () => {
    const onConfirmar = vi.fn()
    const user = userEvent.setup()

    render(
      <ConfirmarPedido totales={TOTALES} esContratista={false} tieneCuentaCorriente onConfirmar={onConfirmar} />,
    )

    //sin cuenta corriente no debería existir el checkbox antes de elegir rol, pero con tieneCuentaCorriente sí aparece.
    await user.click(screen.getByRole('radio', { name: 'Despacho a domicilio' }))
    await user.type(screen.getByLabelText('Dirección de despacho'), 'Las Heras 850, La Serena')
    await user.click(screen.getByLabelText('Pagar mediante cuenta corriente'))
    await user.click(screen.getByRole('button', { name: /Confirmar pedido/ }))

    expect(onConfirmar).toHaveBeenCalledWith({
      entrega: 'despacho',
      direccionDespacho: 'Las Heras 850, La Serena',
      metodoPago: 'tarjeta',
      usarCuentaCorriente: true,
    })
  })

  it('no muestra la opción de cuenta corriente si el contratista no la tiene', () => {
    render(
      <ConfirmarPedido totales={TOTALES} esContratista tieneCuentaCorriente={false} onConfirmar={() => {}} />,
    )

    expect(screen.queryByLabelText('Pagar mediante cuenta corriente')).not.toBeInTheDocument()
  })
})