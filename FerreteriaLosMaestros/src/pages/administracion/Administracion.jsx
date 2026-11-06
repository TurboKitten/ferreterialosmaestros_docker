import ControlStockAdmin from '../../componente/ControlStockAdmin'
import TablaCuentasAdmin from '../../componente/TablaCuentasAdmin'
import FormularioNuevoUsuario from '../../componente/FormularioNuevoUsuario'

//panel del administrador / dueño: inventario, cuentas corrientes y personal.
export default function Administracion() {
  return (
    <main className="container py-4">
      <h1 className="h3 fw-bold mb-4">
        <i className="bi bi-gear-fill me-2" />Panel de Administración
      </h1>
      <ControlStockAdmin />
      <TablaCuentasAdmin />
      <FormularioNuevoUsuario />
    </main>
  )
}