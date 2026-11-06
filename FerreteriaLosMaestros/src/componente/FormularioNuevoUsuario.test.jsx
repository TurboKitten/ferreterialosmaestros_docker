import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import FormularioNuevoUsuario from './FormularioNuevoUsuario'

beforeEach(() => {
  localStorage.setItem(
    'admin_usuarios',
    JSON.stringify([{ nombre: 'Diego Garrido', usuario: 'dgarrid', rol: 'Vendedor', estado: 'Activo', password: '1234' }]),
  )
})
afterEach(() => {
  localStorage.clear()
})

describe('FormularioNuevoUsuario', () => {
  it('muestra los errores al enviar el formulario vacío', async () => {
    const user = userEvent.setup()
    render(<FormularioNuevoUsuario />)
    await user.click(screen.getByRole('button', { name: /Agregar/ }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('El usuario es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()
  })

  it('advierte cuando el nombre de usuario ya existe', async () => {
    const user = userEvent.setup()
    render(<FormularioNuevoUsuario />)
    await user.type(screen.getByLabelText(/Nombre Completo/), 'Diego Garrido Jr.')
    await user.type(screen.getByLabelText(/Usuario/), 'dgarrid')
    await user.type(screen.getByLabelText(/Contraseña/), '4321')
    await user.click(screen.getByRole('button', { name: /Agregar/ }))
    expect(screen.getByText(/ya existe/)).toBeInTheDocument()
  })

  it('registra un nuevo usuario, lo muestra en la tabla y lo persiste', async () => {
    const user = userEvent.setup()
    render(<FormularioNuevoUsuario />)
    await user.type(screen.getByLabelText(/Nombre Completo/), 'Pedro Valdés')
    await user.type(screen.getByLabelText(/Usuario/), 'pvaldes')
    await user.type(screen.getByLabelText(/Contraseña/), 'clave123')
    await user.selectOptions(screen.getByLabelText(/Rol asignado/), 'Contratista')
    await user.click(screen.getByRole('button', { name: /Agregar/ }))
    expect(screen.getByText(/agregado correctamente como/)).toBeInTheDocument()
    // "Pedro Valdés" aparece en la tabla del formulario y en la alerta de éxito.
    expect(screen.getAllByText('Pedro Valdés').length).toBeGreaterThan(0)

    const guardados = JSON.parse(localStorage.getItem('admin_usuarios'))
    expect(guardados).toHaveLength(2)
    expect(guardados.find((u) => u.usuario === 'pvaldes')).toMatchObject({
      nombre: 'Pedro Valdés',
      rol: 'Contratista',
      estado: 'Activo',
    })
  })
})