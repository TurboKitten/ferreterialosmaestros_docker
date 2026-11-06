import { obtenerDatosIniciales } from './datosIniciales'
import { api } from './api'

const {
  productos: productosIniciales,
  usuarios: usuariosIniciales,
  cuentas: cuentasIniciales,
} = obtenerDatosIniciales()

export const CLAVES = {
  productos: 'admin_productos',
  usuarios: 'admin_usuarios',
  cuentas: 'admin_cuentas',
  pedidos: 'admin_pedidos',
  sesion: 'sesionActiva',
}

export function leerJSON(clave, valorInicial = []) {
  try {
    const datos = localStorage.getItem(clave)
    return datos ? JSON.parse(datos) : valorInicial
  } catch (error) {
    console.error(`No se pudieron leer los datos: ${clave}`, error)
    return valorInicial
  }
}

export function escribirJSON(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos))
}

function mapProductoApi(p) {
  // backend: {id,codigo,nombre,categoria,precio,stock,...} -> frontend: {codigo,producto,categoria,precio,stock,...}
  return {
    ...p,
    producto: p.producto ?? p.nombre ?? '',
    nombre: p.nombre ?? p.producto ?? '',
    precio: Number(p.precio ?? 0),
    stock: Number(p.stock ?? 0),
  }
}

function mergeProductoImagenes(actuales, nuevos) {
  const porCodigo = new Map((actuales || []).map((p) => [p.codigo, p]))
  return nuevos.map((p) => {
    const prev = porCodigo.get(p.codigo)
    return { ...(prev || {}), ...p, imagen: p.imagen ?? prev?.imagen, minimo: p.minimo ?? prev?.minimo }
  })
}

export function cargarProductos() {
  return leerJSON(CLAVES.productos, productosIniciales)
}
export function guardarProductos(productos) {
  escribirJSON(CLAVES.productos, productos)
}
export async function fetchProductos() {
  try {
    const data = await api.get('/v1/productos')
    const actuales = cargarProductos()
    const mapped = mergeProductoImagenes(actuales, (Array.isArray(data) ? data : []).map(mapProductoApi))
    guardarProductos(mapped)
    return mapped
  } catch (e) {
    console.warn('No se pudo cargar productos desde API, usando caché/local', e)
    return cargarProductos()
  }
}

export function cargarUsuarios() {
  return leerJSON(CLAVES.usuarios, usuariosIniciales)
}
export function guardarUsuarios(usuarios) {
  escribirJSON(CLAVES.usuarios, usuarios)
}
export async function fetchUsuarios() {
  try {
    const data = await api.get('/v1/usuarios')
    const mapped = (Array.isArray(data) ? data : []).map((u) => ({
      ...u,
      usuario: u.usuario ?? u.username,
      estado: u.enabled === false ? 'Inactivo' : (u.estado || 'Activo'),
    }))
    guardarUsuarios(mapped)
    return mapped
  } catch (e) {
    console.warn('No se pudo cargar usuarios desde API, usando caché/local', e)
    return cargarUsuarios()
  }
}

export function cargarCuentas() {
  return leerJSON(CLAVES.cuentas, cuentasIniciales)
}
export function guardarCuentas(cuentas) {
  escribirJSON(CLAVES.cuentas, cuentas)
}
export async function fetchCuentas() {
  // MVP: sin endpoint backend aún; mantener local
  return cargarCuentas()
}

export function cargarPedidos() {
  return leerJSON(CLAVES.pedidos, [])
}
export function guardarPedidos(pedidos) {
  escribirJSON(CLAVES.pedidos, pedidos)
}
export async function fetchPedidos() {
  try {
    const data = await api.get('/v1/pedidos')
    const mapped = Array.isArray(data) ? data : []
    guardarPedidos(mapped)
    return mapped
  } catch (e) {
    console.warn('No se pudo cargar pedidos desde API, usando caché/local', e)
    return cargarPedidos()
  }
}

export function obtenerSesion() {
  return leerJSON(CLAVES.sesion, null)
}
export function iniciarSesion(usuario) {
  escribirJSON(CLAVES.sesion, {
    nombre: usuario.nombre,
    usuario: usuario.usuario,
    rol: usuario.rol,
  })
}
export async function loginApi(usuario, password) {
  const sesion = await api.post('/v1/auth/login', { usuario, password })
  iniciarSesion({ nombre: sesion.nombre, usuario: sesion.usuario, rol: sesion.rol })
  return sesion
}
export function cerrarSesion() {
  localStorage.removeItem(CLAVES.sesion)
  notificarSesion()
}

export function notificarSesion() {
  window.dispatchEvent(new Event('ferreteria:sesion'))
}

export function obtenerClaveCarrito() {
  const sesion = obtenerSesion()
  return sesion ? `carrito_${sesion.usuario}` : 'carrito_invitado'
}
export function cargarCarrito() {
  return leerJSON(obtenerClaveCarrito(), [])
}
export function guardarCarrito(carrito) {
  escribirJSON(obtenerClaveCarrito(), carrito)
}

export function inicializarDatos() {
  if (!localStorage.getItem(CLAVES.productos)) {
    guardarProductos(productosIniciales)
  }
  if (!localStorage.getItem(CLAVES.usuarios)) {
    guardarUsuarios(usuariosIniciales)
  }
  if (!localStorage.getItem(CLAVES.cuentas)) {
    guardarCuentas(cuentasIniciales)
  }
}

export const ROLES_CLIENTE = ['Cliente', 'Usuario', 'Contratista']

export function esRolCliente(rol) {
  return ROLES_CLIENTE.includes(rol)
}
