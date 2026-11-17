import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import Header from './Header'

const sesionAdmin = {
  nombre: 'Administrador',
  usuario: 'admin',
  rol: 'Administrador',
  token: 'jwt-de-prueba',
}

function renderHeader(props = {}) {
  return render(
    <MemoryRouter>
      <Header sesion={sesionAdmin} onCerrarSesion={vi.fn()} {...props} />
    </MemoryRouter>,
  )
}

const botonSesion = () => screen.getByRole('button', { name: /Administrador/i })
const menuSesion = () => document.getElementById('menuSesion')

describe('Header', () => {
  it('muestra el menú cerrado al iniciar', () => {
    renderHeader()
    expect(botonSesion()).toHaveAttribute('aria-expanded', 'false')
    expect(menuSesion()).not.toHaveClass('show')
  })

  it('abre y cierra el menú al presionar el botón', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(botonSesion())
    expect(botonSesion()).toHaveAttribute('aria-expanded', 'true')
    expect(menuSesion()).toHaveClass('show')

    await user.click(botonSesion())
    expect(botonSesion()).toHaveAttribute('aria-expanded', 'false')
    expect(menuSesion()).not.toHaveClass('show')
  })

  it('se cierra al hacer clic fuera del menú', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(botonSesion())
    expect(menuSesion()).toHaveClass('show')

    await user.click(document.body)
    expect(botonSesion()).toHaveAttribute('aria-expanded', 'false')
    expect(menuSesion()).not.toHaveClass('show')
  })

  it('se cierra al presionar Escape', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(botonSesion())
    expect(menuSesion()).toHaveClass('show')

    await user.keyboard('{Escape}')
    expect(botonSesion()).toHaveAttribute('aria-expanded', 'false')
    expect(menuSesion()).not.toHaveClass('show')
  })

  it('cierra el menú y la sesión al pulsar Cerrar sesión', async () => {
    const onCerrarSesion = vi.fn()
    const user = userEvent.setup()
    renderHeader({ onCerrarSesion })

    await user.click(botonSesion())
    await user.click(screen.getByRole('button', { name: /Cerrar sesión/i }))

    expect(onCerrarSesion).toHaveBeenCalledTimes(1)
    expect(menuSesion()).not.toHaveClass('show')
  })
})
