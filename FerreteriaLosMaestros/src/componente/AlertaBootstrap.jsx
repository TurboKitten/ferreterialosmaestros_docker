export default function AlertaBootstrap({ tipo = 'success', children, onClose }) {
  return (
    <div className={`alert alert-${tipo} alert-dismissible fade show shadow-sm my-3`} role="alert">
      <div>{children}</div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Cerrar"
          onClick={onClose}
        />
      )}
    </div>
  )
}                                                                                                          