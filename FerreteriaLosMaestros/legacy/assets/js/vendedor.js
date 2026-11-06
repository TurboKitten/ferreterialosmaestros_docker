document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formVenta");
    const selectProducto = document.getElementById("selectProductoVenta");
    const cantidadInput = document.getElementById("cantidadVenta");
    const tarifaSelect = document.getElementById("tarifaCliente");
    const detalleVenta = document.getElementById("detalleVenta");
    const subtotalNeto = document.getElementById("subtotalNeto");
    const ivaVenta = document.getElementById("ivaVenta");
    const totalVenta = document.getElementById("totalVenta");
    const metodoPago = document.getElementById("metodoPagoVenta");
    const btnCobrar = document.getElementById("btnCobrarVenta");
    const tablaPedidos = document.getElementById("tablaPedidos");

    //datos

    let productos = cargarProductos();
    let detalle = [];
    let pedidos = cargarPedidos();

    //formato dinero

    function formatoPesos(valor) {

        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }).format(valor);

    }

    //cargar productos
    function cargarProductos() {

        try {
            const datos = JSON.parse(localStorage.getItem("admin_productos"));
            if (Array.isArray(datos)) {
                return datos;
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
        return [];
    }

    //cargar pedidos
    function cargarPedidos() {

        try {
            const datos = JSON.parse(localStorage.getItem("admin_pedidos"));
            if (Array.isArray(datos)) {
                return datos;
            }
        } catch (error) {
            console.error("Error al cargar pedidos:",error);
        }
        return [];
    }


    //guardar pedidos
    function guardarPedidos() {
        localStorage.setItem("admin_pedidos",JSON.stringify(pedidos));
    }


    //guardar productos
    function guardarProductos() {
        localStorage.setItem("admin_productos",JSON.stringify(productos));
    }


    //selector
    function renderizarProductos() {

        if (!selectProducto) {
            return;
        }

        selectProducto.innerHTML = `
            <option value="">
                -- Seleccionar Producto --
            </option>
        `;

        productos.forEach(producto => {

            const opcion = document.createElement("option");

            opcion.value =producto.codigo;
            opcion.textContent =`${producto.producto} - Stock: ${producto.stock}`;
            opcion.disabled =producto.stock <= 0;

            selectProducto.appendChild(opcion);
        });
    }


    //tarifas

    function obtenerPrecio(producto) {
        let precio =Number(producto.precio) || 0;

        if (
            tarifaSelect &&
            tarifaSelect.value === "contratista"
        ) {
            precio =
                precio * 0.85;
        }
        return precio;
    }


    //renderizar detalle de venta

    function renderizarDetalle() {
        if (!detalleVenta) {
            return;
        }
        detalleVenta.innerHTML = "";
        detalle.forEach((item, indice) => {

            const fila =document.createElement("tr");
            fila.innerHTML = `
                <td>
                    ${item.producto}
                </td>
                <td class="text-center">
                    ${item.cantidad}
                </td>
                <td class="text-end">
                    ${formatoPesos(item.precioUnitario)}
                </td>
                <td class="text-end">
                    ${formatoPesos(item.subtotal)}
                </td>
                <td class="text-center">
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm py-0 px-1"
                        data-quitar="${indice}"
                        title="Quitar producto">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            detalleVenta.appendChild(fila);
        });
        calcularTotales();
    }

    //calcular totales
    function calcularTotales() {
        let totalBruto = 0;
        detalle.forEach(item => {
            totalBruto += item.subtotal;
        });

        //precios finales con iva incluido 
        const neto = totalBruto / 1.19;
        const iva = totalBruto - neto;

        if (subtotalNeto) {
            subtotalNeto.textContent = formatoPesos(Math.round(neto));
        }

        if (ivaVenta) {
            ivaVenta.textContent = formatoPesos(Math.round(iva));
        }

        if (totalVenta) {
            totalVenta.textContent = formatoPesos(Math.round(totalBruto));
        }

    }

    //agregar producto al detalle de venta
    if (formulario) {

        formulario.addEventListener(
            "submit",
            event => {
                event.preventDefault();
                if (!selectProducto) {
                    return;
                }

                const codigo =selectProducto.value;
                const cantidad =Number(cantidadInput.value);

                if (!codigo) {
                    alert(
                        "Debes seleccionar un producto."
                    );
                    return;
                }

                if (
                    !Number.isInteger(cantidad) || cantidad <= 0
                ) {
                    alert("La cantidad debe ser un número entero mayor que 0.");
                    return;
                }

                const producto =
                    productos.find(p => p.codigo === codigo);

                if (!producto) {
                    alert("No se encontró el producto seleccionado.");
                    return;
                }

                if (producto.stock <= 0) {
                    alert("Este producto no tiene stock disponible.");
                    return;
                }

                //revisar ticket
                const existente =detalle.find(item => item.codigo === codigo);

                const cantidadYaAgregada = existente
                        ? existente.cantidad
                        : 0;
                if (cantidadYaAgregada + cantidad > producto.stock) {
                    alert(`No hay suficiente stock. ` + `Disponible: ${producto.stock} unidades.`);
                    return;
                }

                //precio tarifa
                const precio =
                    obtenerPrecio(producto);

                if (existente) {
                    existente.cantidad += cantidad;
                    existente.subtotal = existente.cantidad * existente.precioUnitario;
                } else {
                    detalle.push({
                        codigo: producto.codigo,
                        producto:producto.producto,
                        cantidad:cantidad,
                        precioUnitario:precio,
                        subtotal:cantidad * precio
                    });

                }

                //limpiar cantidad
                cantidadInput.value = 1;
                renderizarDetalle();
            }
        );

    }


    //cambio tarifa

    if (tarifaSelect) {
        tarifaSelect.addEventListener(
            "change",
            () => {

                //recalculo
                detalle.forEach(item => {

                    const producto = productos.find(p => p.codigo === item.codigo);

                    if (!producto) {
                        return;
                    }

                    item.precioUnitario =obtenerPrecio(producto);
                    item.subtotal = item.cantidad * item.precioUnitario;

                });

                renderizarDetalle();

            }
        );

    }

    //quitar productos
    if (detalleVenta) {
        detalleVenta.addEventListener(
            "click",
            event => {

                const boton =
                    event.target.closest("[data-quitar]");

                if (!boton) {
                    return;
                }

                const indice =
                    Number(
                        boton.dataset.quitar
                    );

                if (Number.isNaN(indice)) {
                    return;
                }

                detalle.splice(
                    indice,
                    1
                );

                renderizarDetalle();
            }
        );
    }


    //cobrar y emitir boleta
    if (btnCobrar) {

        btnCobrar.addEventListener(
            "click",
            () => {
                if (detalle.length === 0) {
                    alert(
                        "No hay productos en la venta."
                    );
                    return;
                }

                if (!metodoPago ||!metodoPago.value ||metodoPago.value.trim() === "") {
                    alert(
                        "Debes seleccionar un método de pago."
                    );
                    return;
                }

                //verificar stock
                for (const item of detalle) {

                    const producto =productos.find(p => p.codigo === item.codigo);

                    if (!producto) {
                        alert(`El producto ${item.producto} ya no existe.`);
                        return;
                    }

                    if (item.cantidad > producto.stock) {
                        alert(`No hay suficiente stock de ${item.producto}.`);
                        return;
                    }

                }

                //descontar stock
                detalle.forEach(item => {
                    const producto =productos.find(p => p.codigo === item.codigo);
                    producto.stock -= item.cantidad;
                });


                //calcular total
                const total =
                    detalle.reduce(
                        (suma, item) =>
                            suma + item.subtotal,
                        0
                    );


                //crear numero de pedido
                const ultimoFolio =
                    pedidos.length > 0
                        ? Math.max(
                            ...pedidos.map(
                                pedido =>
                                    Number(
                                        pedido.folio
                                    ) || 0
                            )
                        )
                        : 1000;

                const nuevoFolio = ultimoFolio + 1;

                //crear pedido
                const nuevoPedido = {

                    folio:nuevoFolio,

                    cliente:" ",
                    estado:"entregado",
                    tipoTarifa:tarifaSelect.value,
                    metodoPago:metodoPago.value,
                    total:Math.round(total),
                    productos:
                        detalle.map(item => ({
                            codigo:item.codigo,
                            producto:item.producto,
                            cantidad:item.cantidad,
                            precioUnitario: Math.round(item.precioUnitario),
                            subtotal:Math.round(item.subtotal)
                        })),

                    fecha:new Date().toISOString(),
                    origen:"vendedor"
                };


                //guardar pedido
                pedidos.push(nuevoPedido);
                guardarPedidos();

                //guardar nuevo stock
                guardarProductos();


                //actualizar interfaz
                renderizarProductos();
                renderizarPedidos();

                alert(
                    `Venta realizada correctamente.\n\n` +
                    `Pedido #${nuevoFolio}\n` +
                    `Total: ${formatoPesos(total)}\n` +
                    `Estado: Entregado`
                );


                //vaciar venta
                detalle = [];
                renderizarDetalle();
                metodoPago.value = "";
                tarifaSelect.value ="general";
                cantidadInput.value = 1;
            }
        );
    }


    //renderizar pedidos
    function renderizarPedidos() {

        if (!tablaPedidos) {
            return;
        }

        tablaPedidos.innerHTML = "";

        pedidos.forEach(pedido => {

            const fila = document.createElement("tr");
            let claseEstado = "bg-secondary";
            let textoEstado = "Desconocido";

            if (pedido.estado === "pendiente") {
                claseEstado ="bg-warning text-dark";
                textoEstado ="Pendiente";
            }

            if (pedido.estado === "preparacion") {
                claseEstado="bg-info text-dark";
                textoEstado ="En Preparación";
            }

            if (pedido.estado === "entregado") {
                claseEstado ="bg-success";
                textoEstado ="Entregado";
            }

            fila.innerHTML = `
                <td>
                    <strong>#${pedido.folio}</strong>
                    <br>
                    <small class="text-muted">
                        ${pedido.cliente || " "}
                    </small>
                </td>
                <td>
                    <span class="badge ${claseEstado}">
                        ${textoEstado}
                    </span>
                </td>
                <td class="text-end">
                    <select
                        class="form-select form-select-sm d-inline-block w-auto"
                        data-estado-pedido="${pedido.folio}">
                        <option value="" disabled>
                            Estado
                        </option>
                        <option
                            value="pendiente"
                            ${pedido.estado === "pendiente"
                                ? "selected"
                                : ""}>
                            Pendiente
                        </option>
                        <option
                            value="preparacion"
                            ${pedido.estado === "preparacion"
                                ? "selected"
                                : ""}>
                            En Preparación
                        </option>
                        <option
                            value="entregado"
                            ${pedido.estado === "entregado"
                                ? "selected"
                                : ""}>
                            Entregado
                        </option>
                    </select>
                </td>
            `;
            tablaPedidos.appendChild(fila);
        });
    }


    //cambiar estado de pedido
    if (tablaPedidos) {
        tablaPedidos.addEventListener(
            "change",
            event => {
                const selector = event.target.closest("[data-estado-pedido]");

                if (!selector) {
                    return;
                }

                const folio =Number(selector.dataset.estadoPedido);
                const nuevoEstado = selector.value;
                const pedido =pedidos.find(p => Number(p.folio) === folio);

                if (!pedido) {
                    return;
                }

                pedido.estado = nuevoEstado;
                guardarPedidos();
                renderizarPedidos();
            }
        );
    }


    //en caso de necesitar actualizacion de datos
    window.addEventListener(
        "storage",
        event => {
            if (event.key === "admin_productos") {
                productos =cargarProductos();
                renderizarProductos();
            }

            if (event.key === "admin_pedidos") {
                pedidos = cargarPedidos();
                renderizarPedidos();
            }
        }
    );

    renderizarProductos();
    renderizarDetalle();
    renderizarPedidos();
});