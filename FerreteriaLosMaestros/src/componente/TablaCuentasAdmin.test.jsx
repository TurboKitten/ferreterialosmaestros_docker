import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import TablaCuentasAdmin from './TablaCuentasAdmin'

const CUENTAS = [
  { empresa: 'Constructora Andes Ltda.', rut: '76.123.456-7', credito: 2000000, deuda: 850000 },
  { empresa: 'Servicios El Roble SpA', rut: '77.234.567-8', credito: 1500000, deuda: 1500000 },
]

beforeEach(() => {
  localStorage.setItem('admin_cuentas', JSON.stringify(CUENTAS))
})
afterEach(() => {
  localStorage.clear()
})

describe('TablaCuentasAdmin', () => {
  it('muestra las cuentas con su estado según la deuda', () => {
    render(<TablaCuentasAdmin />)
    expect(screen.getByText('Constructora Andes Ltda.')).toBeInTheDocument()
    expect(screen.getByText('Servicios El Roble SpA')).toBeInTheDocument()
    expect(screen.getByText('$850.000')).toBeInTheDocument()
    expect(screen.getAllByText('Cuenta activa')).toHaveLength(1)
    expect(screen.getAllByText('Crédito agotado')).toHaveLength(1)
  })

  it('registra un abono de $500.000 y persiste la nueva deuda', async () => {
    const user = userEvent.setup()
    render(<TablaCuentasAdmin />)

    await user.click(screen.getAllByRole('button', { name: /Abonar \$500\.000/ })[0])

    const alerta = screen.getByRole('alert')
    expect(alerta).toHaveTextContent('Abono registrado para')
    expect(alerta).toHaveTextContent('Constructora Andes Ltda.')

    const cuentas = JSON.parse(localStorage.getItem('admin_cuentas'))
    expect(cuentas.find((c) => c.rut === '76.123.456-7').deuda).toBe(350000)
  })
})