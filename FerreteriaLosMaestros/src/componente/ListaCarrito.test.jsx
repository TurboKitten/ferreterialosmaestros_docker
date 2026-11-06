import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ListaCarrito from './ListaCarrito'

const ITEMS = [
  { codigo: 'FER-001', producto: 'Martillo Profesional', precio: 12990, cantidad: 2 },
  { codigo: 'FER-003', producto: 'Taladro Eléctrico', precio: 49990, cantidad: 1 },
]

describe('ListaCarrito', () => {
  it('muestra los ítems con su precio unitario y subtotal', () => {
    render(<ListaCarrito items={ITEMS} onSumar={() => {}} onRestar={() => {}} onEliminar={() => {}} />)
    expect(screen.getByText('Martillo Profesional')).toBeInTheDocument()
    expect(screen.getByText('$12.990')).toBeInTheDocument() // precio unitario
    expect(screen.getByText('$25.980')).toBeInTheDocument() // 2 x 12.990
    //taladro: precio unitario y subtotal coinciden ($49.990).
    expect(screen.getAllByText('$49.990')).toHaveLength(2)
  })

  it('invoca los callbacks de sumar, restar y eliminar con el código del producto', async () => {
    const user = userEvent.setup()
    const onSumar = vi.fn()
    const onRestar = vi.fn()
    const onEliminar = vi.fn()
    render(<ListaCarrito items={ITEMS} onSumar={onSumar} onRestar={onRestar} onEliminar={onEliminar} />)
    await user.click(screen.getByRole('button', { name: /Agregar una unidad de Martillo Profesional/ }))
    await user.click(screen.getByRole('button', { name: /Quitar una unidad de Taladro Eléctrico/ }))
    await user.click(screen.getByRole('button', { name: /Eliminar Martillo Profesional del carrito/ }))
    expect(onSumar).toHaveBeenCalledWith('FER-001')
    expect(onRestar).toHaveBeenCalledWith('FER-003')
    expect(onEliminar).toHaveBeenCalledWith('FER-001')
  })
})