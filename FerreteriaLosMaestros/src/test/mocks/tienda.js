import imagenMartillo from '../../assets/images/martillo.jpg.jpg'
import imagenTaladro from '../../assets/images/taladro.jpg.webp'
import imagenDestornillador from '../../assets/images/destornillador.jpg.webp'
import imagenAlicate from '../../assets/images/alicate.jpg.webp'
import imagenCemento from '../../assets/images/cemento.jpg.webp'
import imagenGuantes from '../../assets/images/guantes.jpg.webp'
import imagenCinta from '../../assets/images/cinta.jpg.jpg'
import imagenSierra from '../../assets/images/sierra.jpg.webp'

export const PRODUCTOS_INICIALES = [
  {
    codigo: 'FER-001',
    producto: 'Martillo Profesional',
    categoria: 'manuales',
    precio: 12990,
    stock: 15,
    minimo: 10,
    imagen: imagenMartillo,
  },
  {
    codigo: 'FER-002',
    producto: 'Juego de Destornilladores',
    categoria: 'manuales',
    precio: 9990,
    stock: 20,
    minimo: 8,
    imagen: imagenDestornillador,
  },
  {
    codigo: 'FER-003',
    producto: 'Taladro Eléctrico',
    categoria: 'electricas',
    precio: 49990,
    stock: 8,
    minimo: 10,
    imagen: imagenTaladro,
  },
  {
    codigo: 'FER-004',
    producto: 'Sierra Circular',
    categoria: 'electricas',
    precio: 69990,
    stock: 6,
    minimo: 5,
    imagen: imagenSierra,
  },
  {
    codigo: 'FER-005',
    producto: 'Cinta Métrica 5 Metros',
    categoria: 'medicion',
    precio: 4990,
    stock: 18,
    minimo: 10,
    imagen: imagenCinta,
  },
  {
    codigo: 'FER-006',
    producto: 'Cemento 25 Kg',
    categoria: 'construccion',
    precio: 5990,
    stock: 50,
    minimo: 6,
    imagen: imagenCemento,
  },
  {
    codigo: 'FER-007',
    producto: 'Guantes de Trabajo',
    categoria: 'seguridad',
    precio: 3490,
    stock: 30,
    minimo: 10,
    imagen: imagenGuantes,
  },
  {
    codigo: 'FER-008',
    producto: 'Alicate Profesional',
    categoria: 'manuales',
    precio: 7990,
    stock: 12,
    minimo: 10,
    imagen: imagenAlicate,
  },
]

export const USUARIOS_INICIALES = [
  {
    nombre: 'Administrador',
    usuario: 'admin',
    rol: 'Administrador',
    estado: 'Activo',
    password: 'admin123',
  },
  {
    nombre: 'Antonia Abarca',
    usuario: 'aabarca',
    rol: 'Administrador',
    estado: 'Activo',
    password: '1234',
  },
  {
    nombre: 'Diego Garrido',
    usuario: 'dgarrid',
    rol: 'Vendedor',
    estado: 'Activo',
    password: '1234',
  },
  {
    nombre: 'Matias Duncker',
    usuario: 'mduncker',
    rol: 'Contratista',
    estado: 'Activo',
    password: '1234',
    cuentaCorriente: true,
  },
]

export const CUENTAS_INICIALES = [
  {
    empresa: 'Constructora Andes Ltda.',
    rut: '76.123.456-7',
    credito: 2000000,
    deuda: 850000,
  },
  {
    empresa: 'Servicios El Roble SpA',
    rut: '77.234.567-8',
    credito: 1500000,
    deuda: 1200000,
  },
  {
    empresa: 'Construcciones del Sur Ltda.',
    rut: '78.345.678-9',
    credito: 3000000,
    deuda: 500000,
  },
]