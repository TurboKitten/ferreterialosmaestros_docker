import { expect, test } from '@playwright/test'

test('la portada carga y muestra el catálogo de productos', async ({ page }) => {
  await page.goto('/')

  // El h1 del hero; el footer también muestra "Ferretería Los Maestros" como h5.
  await expect(page.getByRole('heading', { name: 'Ferretería Los Maestros', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Catálogo de Productos' })).toBeVisible()
  await expect(page.getByText('Martillo Profesional')).toBeVisible()
})

test('filtra el catálogo por categoría', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Filtrar productos por categoría').selectOption('electricas')

  await expect(page.getByText('Taladro Eléctrico')).toBeVisible()
  await expect(page.getByText('Martillo Profesional')).toBeHidden()
})

test('agrega un producto al carrito y aparece en "Mi carrito"', async ({ page }) => {
  await page.goto('/')

  const tarjeta = page.locator('.producto-card[data-codigo="FER-001"]')
  await tarjeta.getByRole('button', { name: 'Agregar al carrito' }).click()

  await expect(page.getByText(/fue agregado al carrito/)).toBeVisible()

  await page.goto('/#/carrito')
  await expect(page.getByRole('heading', { name: /Mi carrito/ })).toBeVisible()
  await expect(page.getByText('Martillo Profesional')).toBeVisible()
})

test('redirige al login al visitar una ruta protegida sin sesión', async ({ page }) => {
  await page.goto('/#/admin')

  await expect(page).toHaveURL(/#\/login/)
  await expect(page.getByRole('button', { name: /Ingresar al Sistema/ })).toBeVisible()
})

test('un administrador inicia sesión y accede a su panel', async ({ page }) => {
  await page.goto('/#/login')

  await page.getByLabel(/Nombre de Usuario/).fill('aabarca')
  await page.getByLabel(/Contraseña/).fill('1234')
  await page.getByRole('button', { name: /Ingresar al Sistema/ }).click()

  await expect(page).toHaveURL(/#\/admin/)
  await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Inventario y Stock Crítico/ })).toBeVisible()
})

test('un vendedor inicia sesión y llega a su punto de venta', async ({ page }) => {
  await page.goto('/#/login')

  await page.getByLabel(/Nombre de Usuario/).fill('dgarrid')
  await page.getByLabel(/Contraseña/).fill('1234')
  await page.getByRole('button', { name: /Ingresar al Sistema/ }).click()

  await expect(page).toHaveURL(/#\/vendedor/)
  await expect(page.getByRole('heading', { name: /Punto de Venta \/ Emisión de Boleta/ })).toBeVisible()
})