document.addEventListener("DOMContentLoaded", () => {

    const productosIniciales = [
        {
            codigo: "FER-001",
            producto: "Martillo Profesional",
            categoria: "Herramientas Manuales",
            precio: 12990,
            stock: 15,
            minimo: 10
        },
        {
            codigo: "FER-002",
            producto: "Juego de Destornilladores",
            categoria: "Herramientas Manuales",
            precio: 9990,
            stock: 20,
            minimo: 8
        },
        {
            codigo: "FER-003",
            producto: "Taladro eléctrico",
            categoria: "Herramientas eléctricas",
            precio: 49990,
            stock: 8,
            minimo: 10
        },
        {
            codigo: "FER-004",
            producto: "Sierra circular",
            categoria: "Herramientas eléctricas",
            precio: 69990,
            stock: 6,
            minimo: 5
        },
        {
            codigo: "FER-005",
            producto: "Cinta métrica 5m",
            categoria: "Medición",
            precio: 4990,
            stock: 18,
            minimo: 10
        },
        {
            codigo: "FER-006",
            producto: "Cemento 25 Kg",
            categoria: "Materiales de Construccion",
            precio: 5990,
            stock: 50,
            minimo: 6
        },
        {
            codigo: "FER-007",
            producto: "Guantes de trabajo",
            categoria: "Seguridad",
            precio: 3490,
            stock: 30,
            minimo: 10
        },
        {
            codigo: "FER-008",
            producto: "Alicate Profesional",
            categoria: "Herramientas Manuales",
            precio: 7990,
            stock: 12,
            minimo: 10
        }
    ];


    const cuentasIniciales = [
        {
            empresa: "Constructora Andes Ltda.",
            rut: "76.123.456-7",
            credito: 2000000,
            deuda: 850000
        },
        {
            empresa: "Servicios El Roble SpA",
            rut: "77.234.567-8",
            credito: 1500000,
            deuda: 1200000
        },
        {
            empresa: "Construcciones del Sur Ltda.",
            rut: "78.345.678-9",
            credito: 3000000,
            deuda: 500000
        }
    ];


    const usuariosIniciales = [
        {
            nombre: "Antonia Abarca",
            usuario: "aabarca",
            rol: "Administrador",
            estado: "Activo",
            password: "1234"
        },
        {
            nombre: "Diego Garrido",
            usuario: "dgarrid",
            rol: "Vendedor",
            estado: "Activo",
            password: "1234"
        },
        {
            nombre: "Matias Duncker",
            usuario: "mduncker",
            rol: "Contratista",
            estado: "Activo",
            password: "1234"
        }
    ];

    //cargar datos

    let productos = cargar("admin_productos", productosIniciales);

    productos = productos.map(producto => {
    const productoInicial = productosIniciales.find(p => p.codigo === producto.codigo);

    if (productoInicial && !producto.precio) {
        producto.precio = productoInicial.precio;
    }
    return producto;
    });
    guardar("admin_productos", productos); 

    let cuentas = cargar("admin_cuentas", cuentasIniciales);
    let usuarios = cargar("admin_usuarios", usuariosIniciales);

    usuarios = usuarios.map(usuario => {
    if (!usuario.password) {
        usuario.password = "1234";
    }

    return usuario;
    });

    guardar("admin_usuarios", usuarios);

    const tablaStock = document.getElementById("tablaStockAdmin");
    const tablaCuentas = document.getElementById("tablaCuentasAdmin");
    const tablaUsuarios = document.getElementById("tablaUsuariosAdmin");
    const formUsuario = document.getElementById("formNuevoUsuario");

    //funciones auxiliares
    function cargar(clave, valorInicial) {

        try {
            const guardado = localStorage.getItem(clave);
            if (guardado) {
                return JSON.parse(guardado);
            }
            return valorInicial;

        } catch (error) {
            console.error(
                `No se pudieron cargar los datos: ${clave}`,
                error
            );
            return valorInicial;
        }
    }


    function guardar(clave, datos) {
        localStorage.setItem(
            clave,
            JSON.stringify(datos)
        );
    }


    function mostrarAlerta(mensaje, tipo = "success") {
        const contenedor = document.getElementById("alertaAdmin");
        if (!contenedor) return;


        contenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm"
                 role="alert">
                ${mensaje}
                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Cerrar">
                </button>
            </div>
        `;

        //elimina la alerta después de unos segundos
        setTimeout(() => {
            const alerta = contenedor.querySelector(".alert");
            if (alerta) {
                alerta.remove();
            }
        }, 3500);
    }

    function formatoPesos(valor) {
        return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }).format(valor);
    }

    //inventario

    function renderizarProductos() {
        if (!tablaStock) return;
        tablaStock.innerHTML = "";

        productos.forEach((p, indice) => {
            const critico = p.stock <= p.minimo;
            const estado =
                critico
                    ? "Stock crítico"
                    : "Stock normal";
            const claseEstado =
                critico
                    ? "bg-danger"
                    : "bg-success";
            const fila =
                document.createElement("tr");

            fila.innerHTML = `
                <td>
                    <strong>${p.codigo}</strong>
                </td>
                <td>
                    ${p.producto}
                </td>
                <td>
                    ${p.categoria}
                </td>
                <td class="text-center fw-bold">
                    ${p.stock}
                </td>
                <td class="text-center">
                    ${p.minimo}
                </td>
                <td class="text-center">
                    <span class="badge ${claseEstado}">
                        ${estado}
                    </span>
                </td>
                <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">           
                    <input type="number" class="form-control form-control-sm" min="1" value="1" style="width: 75px;" data-cantidad="${indice}">
                    <button class="btn btn-sm btn-outline-success fw-bold" data-accion="agregar-stock" data-indice="${indice}" title="Agregar unidades">
                    <i class="bi bi-plus-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger fw-bold" data-accion="quitar-stock" data-indice="${indice}" title="Quitar unidades">
                    <i class="bi bi-dash-lg"></i>
                    </button>
                </div>
            </td>
            `;
            tablaStock.appendChild(fila);
        });
        actualizarKPIs();
    }

    //cuentas corrientes
    function renderizarCuentas() {

        if (!tablaCuentas) return;
        tablaCuentas.innerHTML = "";
        cuentas.forEach((cuenta, indice) => {

            const sobreLimite = cuenta.deuda >= cuenta.credito;
            const estado =
                sobreLimite
                    ? "Crédito agotado"
                    : "Cuenta activa";
            const claseEstado =
                sobreLimite
                    ? "bg-danger"
                    : "bg-success";
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>
                    <strong>
                        ${cuenta.empresa}
                    </strong>
                </td>
                <td>
                    ${cuenta.rut}
                </td>
                <td class="text-end">
                    ${formatoPesos(cuenta.credito)}
                </td>
                <td class="text-end">
                    ${formatoPesos(cuenta.deuda)}
                </td>
                <td class="text-center">
                    <span class="badge ${claseEstado}">
                        ${estado}
                    </span>
                </td>
                <td class="text-center">
                    <button
                        class="btn btn-sm btn-outline-success fw-bold"
                        data-accion="abonar"
                        data-indice="${indice}">
                        <i class="bi bi-cash-coin me-1"></i>
                        Abonar $500.000
                    </button>
                </td>
            `;
            tablaCuentas.appendChild(fila);
        });
        actualizarKPIs();
    }

    //usuarios
    function renderizarUsuarios() {
        if (!tablaUsuarios) return;
        tablaUsuarios.innerHTML = "";
        usuarios.forEach(usuario => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>
                    ${usuario.nombre}
                </td>
                <td>
                    ${usuario.usuario}
                </td>
                <td>
                    ${usuario.rol}
                </td>
                <td>
                    <span class="badge ${
                        usuario.estado === "Activo"
                            ? "bg-success"
                            : "bg-secondary"
                    }">
                        ${usuario.estado}
                    </span>
                </td>
            `;
            tablaUsuarios.appendChild(fila);
        });
        actualizarKPIs();
    }

    //actualizar kpi
    function actualizarKPIs() {

        const totalProductos =document.getElementById("kpiTotalProductos");
        const stockCritico = document.getElementById("kpiStockCritico");
        if (totalProductos) {
            totalProductos.textContent = productos.length;
        }
        if (stockCritico) {
            stockCritico.textContent = productos.filter(p => p.stock <= p.minimo).length;
        }
    }

    // modificar stock
        if (tablaStock) {
            tablaStock.addEventListener(
                "click", event => {
                    const boton = event.target.closest('[data-accion="agregar-stock"], [data-accion="quitar-stock"]');

                    if (!boton) return;

                    const indice = Number(boton.dataset.indice);
                    const producto = productos[indice];

                    if (!producto) return;
                    
                    const input = tablaStock.querySelector(
                            `[data-cantidad="${indice}"]`
                        );

                    const cantidad = Number(input.value);

                    if (!Number.isInteger(cantidad) || cantidad <= 0) {
                        mostrarAlerta(
                            "Ingresa una cantidad válida mayor que 0.",
                            "danger"
                        );
                        return;
                    }

                    const agregar = boton.dataset.accion === "agregar-stock";

                    if (agregar) {
                        producto.stock += cantidad;
                        guardar( "admin_productos", productos);

                        renderizarProductos();

                        mostrarAlerta(
                            `Se agregaron <strong>${cantidad} unidades</strong>
                            de ${producto.producto}.
                            Stock actual:
                            <strong>${producto.stock}</strong>.`,
                            "success"
                        );

                    } else {
                        if (cantidad > producto.stock) {
                            mostrarAlerta(
                                `No puedes quitar <strong>${cantidad}</strong>
                                unidades porque ${producto.producto}
                                solo tiene <strong>${producto.stock}</strong>.`,
                                "danger"
                            );
                            return;
                        }

                        producto.stock -= cantidad;

                        guardar("admin_productos", productos);

                        renderizarProductos();

                        mostrarAlerta(
                            `Se quitaron <strong>${cantidad} unidades</strong>
                            de ${producto.producto}.
                            Stock actual:
                            <strong>${producto.stock}</strong>.`,
                            "warning"
                        );
                    }
                }
            );
        }

    //boton abonar

    if (tablaCuentas) {

        tablaCuentas.addEventListener(
            "click",
            event => {
                const boton = event.target.closest('[data-accion="abonar"]');
                if (!boton) return;
                const indice =Number(boton.dataset.indice);
                const cuenta =cuentas[indice];
                if (!cuenta) return;
                //no permite abonar más que la deuda
                const abono =Math.min(500000,cuenta.deuda);
                cuenta.deuda -= abono;

                guardar("admin_cuentas",cuentas);

                renderizarCuentas();

                mostrarAlerta(
                    `Abono registrado para
                    <strong>${cuenta.empresa}</strong>:
                    ${formatoPesos(abono)}.
                    Deuda restante:
                    <strong>${formatoPesos(cuenta.deuda)}</strong>.`,
                    "success"
                );
            }
        );
    }


    //formulario nuevo usuario
    if (formUsuario) {
        formUsuario.addEventListener("submit", event => {
                event.preventDefault();
                const nombre =
                    document
                        .getElementById("nuevoNombre")
                        .value
                        .trim();
                const usuario =
                    document
                        .getElementById("nuevoUsuario")
                        .value
                        .trim();
                const rol =
                    document
                        .getElementById("nuevoRol")
                        .value;
                const password =
                    document
                        .getElementById("nuevoPassword")
                        .value;

                //validar campos
                if (!nombre || !usuario || !rol || !password) {

                    mostrarAlerta("Completa todos los campos obligatorios.","danger");
                    return;
                }
                const usuarioNormalizado =
                    usuario.toLowerCase();

                // comprobar si el usuario ya existe
                const existe = usuarios.some(
                        u =>
                            u.usuario.toLowerCase() ===
                            usuarioNormalizado
                    );

                if (existe) {
                    mostrarAlerta(

                        `El usuario
                        <strong>${usuario}</strong>
                        ya existe.
                        Elige otro nombre de usuario.`,
                        "warning"
                    );
                    return;
                }

                //crear nuevo usuario
                usuarios.push({
                    nombre: nombre,
                    usuario: usuarioNormalizado,
                    rol: rol,
                    estado: "Activo",
                    password: password
                });


                guardar(
                    "admin_usuarios",
                    usuarios
                );

                renderizarUsuarios();

                //limpiar formulario
                formUsuario.reset();

                mostrarAlerta(

                    `Usuario
                    <strong>${nombre}</strong>
                    agregado correctamente como
                    <strong>${rol}</strong>.`,
                    "success"
                );
            }
        );
    }

    renderizarProductos();
    renderizarCuentas();
    renderizarUsuarios();
});