import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormularioContacto from './FormularioContacto'

describe('FormularioContacto', () => {
  it('muestra los errores de campos obligatorios al enviar vacío', async () => {
    const user = userEvent.setup()
    render(<FormularioContacto />)
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/ }))
    expect(screen.getByText('El nombre y apellido son obligatorios.')).toBeInTheDocument()
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El teléfono es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un motivo de consulta.')).toBeInTheDocument()
    expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument()
  })

  it('rechaza un correo con formato inválido', async () => {
    const user = userEvent.setup()
    render(<FormularioContacto />)
    await user.type(screen.getByLabelText(/Nombre y Apellido/), 'Juan Pérez')
    await user.type(screen.getByLabelText(/Correo Electrónico/), 'juan-sin-arroba.cl')
    await user.type(screen.getByLabelText(/Teléfono de Contacto/), '+56 9 1234 5678')
    await user.selectOptions(screen.getByLabelText(/Motivo de tu Consulta/), 'Cotización de Materiales')
    await user.type(screen.getByLabelText(/Mensaje o Detalle de Productos/), 'Necesito cotizar cemento')
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/ }))
    expect(screen.getByText('El formato del correo no es válido.')).toBeInTheDocument()
    expect(screen.queryByText(/nombre y apellido son obligatorios/i)).not.toBeInTheDocument()
  })

  it('con datos válidos no muestra errores y limpia los campos', async () => {
    const user = userEvent.setup()
    render(<FormularioContacto />)
    await user.type(screen.getByLabelText(/Nombre y Apellido/), 'Juan Pérez')
    await user.type(screen.getByLabelText(/Correo Electrónico/), 'juan@correo.cl')
    await user.type(screen.getByLabelText(/Teléfono de Contacto/), '+56 9 1234 5678')
    await user.selectOptions(screen.getByLabelText(/Motivo de tu Consulta/), 'Consulta de Stock')
    await user.type(screen.getByLabelText(/Mensaje o Detalle de Productos/), '¿Tienen stock de taladros?')
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/ }))
    expect(screen.queryByText(/obligatorio|no es válido|Selecciona un motivo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Gracias por escribirnos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre y Apellido/)).toHaveValue('')
    expect(screen.getByLabelText(/Correo Electrónico/)).toHaveValue('')
  })
})