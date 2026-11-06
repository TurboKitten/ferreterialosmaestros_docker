import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductoCard from './ProductoCard'

describe('ProductoCard', () => {
  
  const producto = { codigo: 'FER-001', producto: 'Martillo Profesional', precio: 12990, stock: 15 }

  it('muestra el nombre, el precio y el stock disponible', () => {
    render(<ProductoCard producto={producto} onAgregar={() => {}} />)
    expect(screen.getByText('Martillo Profesional')).toBeInTheDocument()
    expect(screen.getByText('$12.990')).toBeInTheDocument()
    expect(screen.getByText('15 unidades')).toBeInTheDocument()
  })

  it('deshabilita el botón y muestra "Sin stock" cuando no hay existencias', () => {
    render(<ProductoCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} />)
    expect(screen.getAllByText('Sin stock')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /Sin stock/ })).toBeDisabled()
  })

  it('invoca onAgregar con el código del producto al presionar el botón', async () => {
    const user = userEvent.setup()
    const onAgregar = vi.fn()
    render(<ProductoCard producto={producto} onAgregar={onAgregar} />)
    await user.click(screen.getByRole('button', { name: /Agregar al carrito/ }))
    expect(onAgregar).toHaveBeenCalledWith('FER-001')
  })
})