document.addEventListener("DOMContentLoaded", () => {

        function actualizarStockCatalogo() {
        let productos = [];

        try {

            productos =
                JSON.parse(
                    localStorage.getItem("admin_productos")
                ) || [];

        } catch (error) {
            console.error("No se pudo cargar el stock:",error);
            return;
        }

        const stocks = document.querySelectorAll(".stock-producto");
        stocks.forEach(stockElemento => {

            const codigo = stockElemento.dataset.codigo;
            const producto = productos.find(p => p.codigo === codigo);

            if (!producto) return;

            stockElemento.textContent =
                `${producto.stock} unidades`;

            if (producto.stock <= producto.minimo) {
                stockElemento.classList.remove("text-success");
                stockElemento.classList.add("text-danger");

            } else {
                stockElemento.classList.remove("text-danger");
                stockElemento.classList.add("text-success");
            }
        });
    }

    actualizarStockCatalogo();

    window.addEventListener(
        "storage",
        event => {if (event.key === "admin_productos") {
                actualizarStockCatalogo();
            }
        }
    );

    const botonLogin = document.getElementById("btnIrLogin");

        if (!botonLogin) {
            return;
        }

    const sesion =obtenerSesion();

    //no hay sesion
    if (!sesion) {
        botonLogin.href = "login.html";
        botonLogin.innerHTML = `<i class="bi bi-person-lock me-1"></i>Acceso Usuarios`;
        return;
    }

    const rol =
        sesion.rol.toLowerCase();


    //cliente/usuario/contratista

    if (
        rol === "cliente" ||
        rol === "usuario" ||
        rol === "contratista"
    ) {
        botonLogin.href ="#";
        botonLogin.className ="btn btn-success fw-bold shadow-sm";
        botonLogin.innerHTML = `<i class="bi bi-person-check me-1"></i>
            ${sesion.nombre}`;

        crearMenuUsuario(botonLogin,"cliente");

        return;
    }

    //vendedor
    if (rol === "vendedor") {

        botonLogin.href ="vendedor.html";
        botonLogin.className ="btn btn-primary fw-bold shadow-sm";
        botonLogin.innerHTML = `<i class="bi bi-person-badge me-1"></i>
            ${sesion.nombre}`;

        crearMenuUsuario(botonLogin, "vendedor");
        return;
    }

    //admin
    if (rol === "administrador") {

        botonLogin.href = "admin.html";
        botonLogin.className = "btn btn-danger fw-bold shadow-sm";
        botonLogin.innerHTML = `<i class="bi bi-person-lock me-1"></i>
            ${sesion.nombre}`;

        crearMenuUsuario(botonLogin,"administrador");
    }

    //menu
    function crearMenuUsuario(boton, tipo) {

        const contenedor =boton.parentElement;
        contenedor.classList.add("dropdown");

        boton.classList.add("dropdown-toggle");
        boton.setAttribute("data-bs-toggle","dropdown");
        boton.href = "#";
        const menu = document.createElement("ul");
        menu.className = "dropdown-menu dropdown-menu-end";

        //perfil
        const perfil = document.createElement("li");
        perfil.innerHTML = `
            <span class="dropdown-item-text">
                <strong>${sesion.nombre}</strong><br>
                <small class="text-muted">
                    ${sesion.rol}
                </small>
            </span>
        `;
        menu.appendChild(perfil);
        const volverMenu = document.createElement("li");

        volverMenu.innerHTML = 
            `<a class="dropdown-item" href="index.html"><i class="bi bi-house me-2"></i>Volver al menú
             </a>
        `;

        menu.appendChild(volverMenu);

        //opciones segun rol 
        const opcion = document.createElement("li");

        if (tipo === "cliente") {
            opcion.innerHTML = `
                <a class="dropdown-item" href="carrito.html"><i class="bi bi-cart me-2"></i>Mi carrito
                </a>
            `;
        }


        if (tipo === "vendedor") {
            opcion.innerHTML = `
                <a class="dropdown-item" href="vendedor.html"><i class="bi bi-shop me-2"></i>Panel de vendedor
                </a>
            `;
        }

        if (tipo === "administrador") {
            opcion.innerHTML = `
                <a class="dropdown-item" href="admin.html"><i class="bi bi-gear me-2"></i>Administración
                </a>
            `;
        }
        menu.appendChild(opcion);

        //separador
        const separador = document.createElement("li");

        separador.innerHTML = `<hr class="dropdown-divider">`;
        menu.appendChild(separador);

        //cerrar sesion
        const cerrar = document.createElement("li");
        cerrar.innerHTML = `
            <a class="dropdown-item text-danger" href="#" data-cerrar-sesion><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
            </a>
        `;

        menu.appendChild(cerrar);
        contenedor.appendChild(menu);

        cerrar.querySelector("[data-cerrar-sesion]").addEventListener("click", event => {
                event.preventDefault();
                cerrarSesion();
            });
    }
});