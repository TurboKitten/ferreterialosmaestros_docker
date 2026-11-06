//validaciones reutilizables

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//devuelve true si el valor no está vacío
export function validarRequerido(valor) {
  return String(valor ?? '').trim().length > 0
}

//devuelve true si el string tiene al menos `min` caracteres. 
export function validarLargo(valor, min = 3) {
  return String(valor ?? '').trim().length >= min
}

//valida formato de correo electronica
export function validarEmail(email) {
  return REGEX_EMAIL.test(String(email ?? '').trim())
}

//valida rut
export function validarRut(rut) {
  const normalizado = String(rut ?? '').replace(/[^0-9kK]/g, '').toUpperCase()
  if (normalizado.length < 2) {
    return false
  }

  const cuerpo = normalizado.slice(0, -1)
  const dv = normalizado.slice(-1)

  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }

  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dvEsperado === dv
}

//validacion de formulario 
export function validarCampos(datos, reglas) {
  const errores = {}
  Object.entries(reglas).forEach(([campo, regla]) => {
    const mensaje = regla(datos[campo])
    if (mensaje) {
      errores[campo] = mensaje
    }
  })
  return errores
}