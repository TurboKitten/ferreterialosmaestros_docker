import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Layout from './Layout'

const renderConRuta = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Contenido de la página</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  localStorage.removeItem('sesionActiva')
})

afterEach(() => {
  localStorage.clear()
})

describe('Layout', () => {
  it('renderiza el encabezado, el contenido (Outlet) y el pie de página', () => {
    renderConRuta()

    //outlet
    expect(screen.getByText('Contenido de la página')).toBeInTheDocument()
    //header sin sesion
    expect(screen.getByText(/Panamericana Norte 1498, Coquimbo/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Acceso Usuarios/ })).toBeInTheDocument()
    //footer
    expect(screen.getByText('Ferretería Los Maestros')).toBeInTheDocument()
  })

  it('actualiza el encabezado cuando inicia sesión (evento ferreteria:sesion)', () => {
    renderConRuta()
    expect(screen.getByRole('link', { name: /Acceso Usuarios/ })).toBeInTheDocument()

    act(() => {
      localStorage.setItem(
        'sesionActiva',
        JSON.stringify({ nombre: 'Matías', usuario: 'mduncker', rol: 'Contratista' }),
      )
      window.dispatchEvent(new Event('ferreteria:sesion'))
    })

    expect(screen.getByRole('button', { name: /Matías/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Acceso Usuarios/ })).not.toBeInTheDocument()
  })
})