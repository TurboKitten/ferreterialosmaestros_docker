import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FormularioAcceso from './FormularioAcceso'

const renderConRuta = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <FormularioAcceso />
    </MemoryRouter>,
  )

// Simula la respuesta de la API de login (backend JWT)
function mockFetchLogin(estado, cuerpo) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: estado >= 200 && estado < 300,
        status: estado,
        text: () => Promise.resolve(JSON.stringify(cuerpo)),
      }),
    ),
  )
}

describe('FormularioAcceso', () => {
  beforeEach(() => {
    localStorage.removeItem('sesionActiva')
  })

  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('muestra errores al enviar sin completar los campos', async () => {
    mockFetchLogin(200, {})
    const user = userEvent.setup()
    renderConRuta()
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    expect(screen.getByText('Debes ingresar tu nombre de usuario.')).toBeInTheDocument()
    expect(screen.getByText('Debes ingresar tu contraseña.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rechaza credenciales incorrectas y deja la sesión sin iniciar', async () => {
    mockFetchLogin(401, { message: 'Credenciales inválidas' })
    const user = userEvent.setup()
    renderConRuta()
    await user.type(screen.getByLabelText(/Nombre de Usuario/), 'mvendedor')
    await user.type(screen.getByLabelText(/Contraseña/), 'incorrecta')
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    expect(screen.getByText('El usuario o la contraseña son incorrectos.')).toBeInTheDocument()
    expect(localStorage.getItem('sesionActiva')).toBeNull()
  })

  it('inicia sesión con credenciales válidas y guarda la sesión con token', async () => {
    mockFetchLogin(200, {
      id: 1,
      nombre: 'Miguel Vendedor',
      usuario: 'mvendedor',
      rol: 'Vendedor',
      token: 'jwt-de-prueba',
    })
    const user = userEvent.setup()
    renderConRuta()
    await user.type(screen.getByLabelText(/Nombre de Usuario/), 'mvendedor')
    await user.type(screen.getByLabelText(/Contraseña/), '1234')
    await user.click(screen.getByRole('button', { name: /Ingresar al Sistema/ }))
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'))
    expect(sesion.usuario).toBe('mvendedor')
    expect(sesion.rol).toBe('Vendedor')
    expect(sesion.token).toBe('jwt-de-prueba')
    // La API debe haber recibido las credenciales en el cuerpo del login
    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toContain('/v1/auth/login')
    expect(JSON.parse(opciones.body)).toEqual({ usuario: 'mvendedor', password: '1234' })
  })
})
