export function formatoPesos(valor) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) {
    return '$0'
  }
  return '$' + Math.round(numero).toLocaleString('es-CL')
}


export function formatoPesosIntl(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0)
}