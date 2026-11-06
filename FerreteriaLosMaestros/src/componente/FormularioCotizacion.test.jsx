import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FormularioCotizacion from './FormularioCotizacion'

describe('FormularioCotizacion', () => {
  it('muestra los errores al enviar vacío, incluido el RUT', async () => {
    const user = userEvent.setup()
    render(<FormularioCotizacion />)
    await user.click(screen.getByRole('button', { name: /Enviar Solicitud de Cotización/ }))
    expect(screen.getByText('El nombre completo es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El RUT es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona tu perfil.')).toBeInTheDocument()
  })

  it('rechaza un RUT con dígito verificador incorrecto', async () => {
    const user = userEvent.setup()
    render(<FormularioCotizacion />)
    await user.type(screen.getByLabelText(/Nombre Completo/), 'Ana Garrido')
    await user.type(screen.getByLabelText(/RUT Personal o Empresa/), '12.345.678-9')
    await user.type(screen.getByLabelText(/Correo Electrónico/), 'ana@constructora.cl')
    await user.type(screen.getByLabelText(/Teléfono o WhatsApp/), '+56 9 1111 2222')
    await user.selectOptions(screen.getByLabelText(/Tipo de Cliente/), 'Empresa Contratista')
    await user.type(screen.getByLabelText(/Comuna o Dirección de Obra/), 'Coquimbo')
    await user.type(
      screen.getByLabelText(/Detalle de Materiales a Cotizar/),
      '30 sacos de cemento y 5 maderas de pino',
    )
    await user.click(screen.getByRole('button', { name: /Enviar Solicitud de Cotización/ }))
    expect(screen.getByText('El RUT ingresado no es válido.')).toBeInTheDocument()
    expect(screen.queryByText('El nombre completo es obligatorio.')).not.toBeInTheDocument()
  })

  it('con datos válidos muestra el mensaje de éxito', async () => {
    const user = userEvent.setup()
    render(<FormularioCotizacion />)

    await user.type(screen.getByLabelText(/Nombre Completo/), 'Ana Garrido')
    await user.type(screen.getByLabelText(/RUT Personal o Empresa/), '12.345.678-5')
    await user.type(screen.getByLabelText(/Correo Electrónico/), 'ana@constructora.cl')
    await user.type(screen.getByLabelText(/Teléfono o WhatsApp/), '+56 9 1111 2222')
    await user.selectOptions(screen.getByLabelText(/Tipo de Cliente/), 'Empresa Contratista')
    await user.type(screen.getByLabelText(/Comuna o Dirección de Obra/), 'Coquimbo')
    await user.type(
      screen.getByLabelText(/Detalle de Materiales a Cotizar/),
      '30 sacos de cemento y 5 maderas de pino',
    )
    await user.click(screen.getByRole('button', { name: /Enviar Solicitud de Cotización/ }))

    expect(screen.getByText(/Solicitud enviada/i)).toBeInTheDocument()
    expect(screen.queryByText(/obligatorio|no es válido/i)).not.toBeInTheDocument()
  })
})