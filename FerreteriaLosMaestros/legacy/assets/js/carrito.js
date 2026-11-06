document.addEventListener("DOMContentLoaded", () => {

    const carritoVacio = document.getElementById("carritoVacio");
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    const tablaCarrito = document.getElementById("tablaCarrito");

    const subtotalCarrito = document.getElementById("subtotalCarrito");
    const descuentoCarritoFila = document.getElementById("descuentoCarritoFila");
    const descuentoCarrito = document.getElementById("descuentoCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    const btnContinuarCompra = document.getElementById("btnContinuarCompra");

    const seccionConfirmacion = document.getElementById("seccionConfirmacion");
    const retiroTienda = document.getElementById("retiroTienda");
    const despachoDomicilio = document.getElementById("despachoDomicilio");
    const contenedorDireccion = document.getElementById("contenedorDireccion");
    const direccionDespacho = document.getElementById("direccionDespacho");

    const metodoPagoCarrito = document.getElementById("metodoPagoCarrito");
    const contenedorCuentaCorriente = document.getElementById("contenedorCuentaCorriente");
    const usarCuentaCorriente = document.getElementById("usarCuentaCorriente");

    const confirmacionSubtotal = document.getElementById("confirmacionSubtotal");
    const confirmacionDescuentoFila = document.getElementById("confirmacionDescuentoFila");
    const confirmacionDescuento = document.getElementById("confirmacionDescuento");
    const confirmacionTotal = document.getElementById("confirmacionTotal");

    const btnConfirmarPedido = document.getElementById("btnConfirmarPedido");

    const tablaMisPedidos = document.getElementById("tablaMisPedidos");
    const sinPedidos = document.getElementById("sinPedidos");
    const contenedorMisPedidos = document.getElementById("contenedorMisPedidos");

    function obtenerSesion() {
        try {
            return JSON.parse(localStorage.getItem("sesionActiva"));
        } catch {
            return null;
        }
    }

    function obtenerClaveCarrito() {
        const sesion = obtenerSesion();
        return sesion ? "carrito_" + sesion.usuario : "carrito_invitado";
    }

    function cargarCarrito() {
        try {
            return JSON.parse(localStorage.getItem(obtenerClaveCarrito())) || [];
        } catch {
            return [];
        }
    }

    function guardarCarrito(carrito) {
        localStorage.setItem(obtenerClaveCarrito(),JSON.stringify(carrito));
    }

    function cargarProductos() {
        try {
            return JSON.parse(localStorage.getItem("admin_productos")) || [];
        } catch {
            return [];
        }
    }

    function esContratista() {
        const sesion = obtenerSesion();
        return sesion && sesion.rol === "contratista";
    }

    function tieneCuentaCorriente() {
        const sesion = obtenerSesion();

        if (!sesion) return false;

        try {
            const usuarios = JSON.parse(localStorage.getItem("admin_usuarios")) || [];
            const usuario = usuarios.find(u => u.usuario === sesion.usuario);

            return usuario && usuario.cuentaCorriente === true;
        } catch {
            return false;
        }
    }

    function formatoPesos(valor) {
        return "$" + Number(valor).toLocaleString("es-CL");
    }

    function calcularTotales(carrito) {
        const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

        const descuento = esContratista()
            ? subtotal * 0.15
            : 0;

        return {
            subtotal,
            descuento,
            total: subtotal - descuento
        };
    }

    function mostrarCarrito() {

        const carrito = cargarCarrito();

        if (carrito.length === 0) {
            carritoVacio.classList.remove("d-none");
            contenidoCarrito.classList.add("d-none");
            seccionConfirmacion.classList.add("d-none");
            return;
        }

        carritoVacio.classList.add("d-none");
        contenidoCarrito.classList.remove("d-none");
        tablaCarrito.innerHTML = "";

        carrito.forEach((item, indice) => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <strong>${item.producto}</strong>
                    <br>
                    <small class="text-muted">${item.codigo}</small>
                </td>
                <td>${formatoPesos(item.precio)}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <button
                            class="btn btn-sm btn-outline-secondary"
                            data-accion="restar"
                            data-indice="${indice}">
                            -
                        </button>
                        <span>${item.cantidad}</span>
                        <button
                            class="btn btn-sm btn-outline-secondary"
                            data-accion="sumar"
                            data-indice="${indice}">
                            +
                        </button>
                    </div>
                </td>
                <td>
                    ${formatoPesos(item.precio * item.cantidad)}
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-outline-danger"
                        data-accion="eliminar"
                        data-indice="${indice}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tablaCarrito.appendChild(fila);
        });
        actualizarTotales();
    }

    function actualizarTotales() {

        const carrito = cargarCarrito();
        const totales = calcularTotales(carrito);

        subtotalCarrito.textContent = formatoPesos(totales.subtotal);
        descuentoCarrito.textContent = formatoPesos(totales.descuento);
        totalCarrito.textContent = formatoPesos(totales.total);
        confirmacionSubtotal.textContent = formatoPesos(totales.subtotal);
        confirmacionDescuento.textContent = formatoPesos(totales.descuento);
        confirmacionTotal.textContent = formatoPesos(totales.total);

        if (esContratista()) {
            descuentoCarritoFila.classList.remove("d-none");
            confirmacionDescuentoFila.classList.remove("d-none");
        } else {
            descuentoCarritoFila.classList.add("d-none");
            confirmacionDescuentoFila.classList.add("d-none");
        }
    }

    tablaCarrito.addEventListener("click", event => {

        const boton = event.target.closest("button");

        if (!boton) return;

        const indice = Number(boton.dataset.indice);
        const accion = boton.dataset.accion;

        const carrito = cargarCarrito();
        const productos = cargarProductos();

        if (!carrito[indice]) return;

        const producto = productos.find(p => p.codigo === carrito[indice].codigo);

        const stock = producto
            ? Number(producto.stock)
            : 0;

        if (accion === "sumar") {
            if (carrito[indice].cantidad >= stock) {
                alert("No puedes superar el stock disponible.");
                return;
            }
            carrito[indice].cantidad++;
        }
        if (accion === "restar") {
            carrito[indice].cantidad--;
            if (carrito[indice].cantidad <= 0) {
                carrito.splice(indice, 1);
            }
        }
        if (accion === "eliminar") {
            carrito.splice(indice, 1);
        }
        guardarCarrito(carrito);
        mostrarCarrito();
    });

    btnContinuarCompra.addEventListener("click", () => {

        seccionConfirmacion.classList.remove("d-none");
        seccionConfirmacion.scrollIntoView({
            behavior: "smooth"
        });
    });

    despachoDomicilio.addEventListener("change", () => {
        contenedorDireccion.classList.remove("d-none");
    });

    retiroTienda.addEventListener("change", () => {
        contenedorDireccion.classList.add("d-none");
    });

    if (tieneCuentaCorriente()) {
        contenedorCuentaCorriente.classList.remove("d-none");
    }

    btnConfirmarPedido.addEventListener("click", () => {

        const carrito = cargarCarrito();

        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        const sesion = obtenerSesion();

        if (!sesion) {
            alert("Debes iniciar sesión para realizar un pedido.");
            window.location.href = "login.html";
            return;
        }

        if (
            despachoDomicilio.checked &&
            direccionDespacho.value.trim() === ""
        ) {
            alert("Ingresa una dirección de despacho.");
            return;
        }

        const productos = cargarProductos();

        //comprobar nuevamente el stock
        for (const item of carrito) {

            const producto = productos.find(p => p.codigo === item.codigo);

            if (!producto || Number(producto.stock) < item.cantidad) {
                alert("No hay suficiente stock de: " + item.producto);
                return;
            }
        }

        //descontar stock
        carrito.forEach(item => {

            const producto = productos.find(p => p.codigo === item.codigo);
            producto.stock -= item.cantidad;
        });

        localStorage.setItem("admin_productos",JSON.stringify(productos));

        const totales = calcularTotales(carrito);

        let metodoPago = metodoPagoCarrito.value;
        let estadoPago = "pagado";

        if (
            tieneCuentaCorriente() &&
            usarCuentaCorriente.checked
        ) {
            metodoPago = "cuenta_corriente";
            estadoPago = "pendiente_fin_mes";
        }

        const pedidos = JSON.parse(localStorage.getItem("admin_pedidos") || "[]");

        const nuevoPedido = {
            folio: "PED-" + Date.now(),

            cliente: sesion.nombre,
            usuario: sesion.usuario,
            rol: sesion.rol,

            productos: carrito.map(item => ({
                codigo: item.codigo,
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                subtotal: item.precio * item.cantidad
            })),

            subtotal: totales.subtotal,
            descuento: totales.descuento,
            total: totales.total,

            entrega: despachoDomicilio.checked
                ? "despacho"
                : "retiro",

            direccionDespacho:
                despachoDomicilio.checked
                    ? direccionDespacho.value.trim()
                    : "",

            metodoPago,
            estadoPago,

            estado: "pendiente",
            fecha: new Date().toLocaleString("es-CL"),
            origen: "carrito"
        };

        pedidos.push(nuevoPedido);

        localStorage.setItem("admin_pedidos", JSON.stringify(pedidos));

        guardarCarrito([]);

        alert("Pedido realizado correctamente.\n\n" + "Número de pedido: " + nuevoPedido.folio);

        seccionConfirmacion.classList.add("d-none");

        mostrarCarrito();
        mostrarPedidos();
    });

    function mostrarPedidos() {

        const sesion = obtenerSesion();

        if (!sesion) return;

        const pedidos = JSON.parse(localStorage.getItem("admin_pedidos") || "[]");
        const misPedidos = pedidos.filter(pedido => pedido.usuario === sesion.usuario);

        if (misPedidos.length === 0) {
            sinPedidos.classList.remove("d-none");
            contenedorMisPedidos.classList.add("d-none");
            return;
        }

        sinPedidos.classList.add("d-none");
        contenedorMisPedidos.classList.remove("d-none");

        tablaMisPedidos.innerHTML = "";

        misPedidos.forEach(pedido => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${pedido.folio}</strong></td>
                <td>${pedido.fecha}</td>
                <td>
                    ${
                        pedido.entrega === "despacho"
                            ? "Despacho"
                            : "Retiro en tienda"
                    }
                </td>
                <td>${formatoPesos(pedido.total)}</td>
                <td>
                    <span class="badge bg-warning text-dark">
                        ${pedido.estado}
                    </span>
                </td>
            `;
            tablaMisPedidos.appendChild(fila);
        });
    }

    window.addEventListener("storage", event => {

        if (
            event.key === "admin_productos" ||
            event.key === obtenerClaveCarrito() ||
            event.key === "admin_pedidos"
        ) {
            mostrarCarrito();
            mostrarPedidos();
        }
    });
    mostrarCarrito();
    mostrarPedidos();
});