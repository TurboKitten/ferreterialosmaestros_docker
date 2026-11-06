//capa de acceso a datos iniciales. Punto de inyeccion para Spring-boot a futuro
//(esta capa se reemplazara por hook/fetch)
import {
  CUENTAS_INICIALES,
  PRODUCTOS_INICIALES,
  USUARIOS_INICIALES,
} from '../test/mocks/tienda'

export function obtenerDatosIniciales() {
  return {
    productos: PRODUCTOS_INICIALES,
    usuarios: USUARIOS_INICIALES,
    cuentas: CUENTAS_INICIALES,
  }
}