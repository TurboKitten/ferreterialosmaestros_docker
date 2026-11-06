import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import FormularioAcceso from './FormularioAcceso'

const renderConRuta = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <FormularioAcceso />
    </MemoryRouter>,
  )

describe('FormularioAcceso', () => {
  beforeEach(() => {
    localStorage.setItem(
      'admin_usuarios',
      JSON.stringify([
        { nombre: 'Miguel Vendedor', usuario: 'mvendedor', rol: 'Vendedor', password: '1234' },
        { nombre: 'Ana Admin', usuario: 'aadmin', rol: 'Administrador', password: 'clave' },
      ]),
    )
    localStorage.removeItem('sesionActiva')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('muestra errores al enviar sin completar los campos', async () => {
    const user = userEvent.setup()
    renderConRuta()
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    expect(screen.getByText('Debes ingresar tu nombre de usuario.')).toBeInTheDocument()
    expect(screen.getByText('Debes ingresar tu contraseña.')).toBeInTheDocument()
  })

  it('rechaza credenciales incorrectas y deja la sesión sin iniciar', async () => {
    const user = userEvent.setup()
    renderConRuta()
    await user.type(screen.getByLabelText(/Nombre de Usuario/), 'mvendedor')
    await user.type(screen.getByLabelText(/Contraseña/), 'incorrecta')
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    expect(screen.getByText('El usuario o la contraseña son incorrectos.')).toBeInTheDocument()
    expect(localStorage.getItem('sesionActiva')).toBeNull()
  })

  it('inicia sesión con credenciales válidas y guarda la sesión', async () => {
    const user = userEvent.setup()
    renderConRuta()
    await user.type(screen.getByLabelText(/Nombre de Usuario/), 'mvendedor')
    await user.type(screen.getByLabelText(/Contraseña/), '1234')
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'))
    expect(sesion.usuario).toBe('mvendedor')
    expect(sesion.rol).toBe('Vendedor')
  })
})