document.addEventListener("DOMContentLoaded", () => {

    const listaProductos = document.getElementById("listaProductos");

    if (!listaProductos) {
        console.error("No se encontró el contenedor #listaProductos.");
        return;
    }

    //precios
    function formatoPesos(valor) {
        return "$" + Number(valor).toLocaleString("es-CL");
    }

    //obtener productos
    function cargarProductos() {

        const datos = localStorage.getItem("admin_productos");

        if (!datos) {
            return [];
        }
        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error("Error al leer los productos:", error);
            return [];
        }
    }


    //obtener carrito del usuario
    function obtenerClaveCarrito() {

        const sesion = localStorage.getItem("sesionActiva");

        if (!sesion) {
            return "carrito_invitado";
        }

        try {

            const usuario = JSON.parse(sesion);

            return "carrito_" + usuario.usuario;

        } catch (error) {
            console.error("Error al leer la sesión:", error);
            return "carrito_invitado";
        }
    }


    //cargar carrito
    function cargarCarrito() {

        const clave = obtenerClaveCarrito();
        const datos = localStorage.getItem(clave);

        if (!datos) {
            return [];
        }

        try {
            return JSON.parse(datos);
        } catch (error) {
            console.error("Error al leer el carrito:", error);
            return [];
        }
    }


    //guardar carrito
    function guardarCarrito(carrito) {
        const clave = obtenerClaveCarrito();
        localStorage.setItem(clave,JSON.stringify(carrito));
    }

    //actualizar stock en pantalla
    function actualizarStock() {
        const productos = cargarProductos();

        document
            .querySelectorAll(".producto-card")
            .forEach(tarjeta => {
                const codigo = tarjeta.dataset.codigo;
                const producto = productos.find(p => p.codigo === codigo);
                const textoStock = tarjeta.querySelector(".stock-producto");
                const boton = tarjeta.querySelector(".btn-agregar-carrito");

                if (!producto) {

                    textoStock.textContent = "No disponible";

                    textoStock.classList.remove("text-success");
                    textoStock.classList.add("text-danger");

                    boton.disabled = true;

                    return;
                }

                const stock = Number(producto.stock) || 0;
                textoStock.textContent = stock + (stock === 1 ? " unidad" : " unidades");

                if (stock <= 0) {

                    textoStock.classList.remove("text-success");
                    textoStock.classList.add("text-danger");

                    boton.disabled = true;
                    boton.innerHTML ='<i class="bi bi-x-circle me-1"></i> Sin stock';

                } else {

                    textoStock.classList.remove("text-danger");
                    textoStock.classList.add("text-success");

                    boton.disabled = false;
                    boton.innerHTML ='<i class="bi bi-cart-plus me-1"></i> Agregar al carrito';
                }
            });
    }

    //agregar al carrito
    function agregarAlCarrito(codigo) {

        const productos = cargarProductos();
        const producto = productos.find(p => p.codigo === codigo);

        if (!producto) {
            alert("No se encontró el producto.");
            return;
        }

        const stock = Number(producto.stock) || 0;

        if (stock <= 0) {
            alert("Este producto no tiene stock disponible.");
            return;
        }

        const carrito = cargarCarrito();
        const productoExistente = carrito.find(item => item.codigo === codigo);

        if (productoExistente) {
            if (productoExistente.cantidad >= stock) {
                alert(
                    "No puedes agregar más unidades de las disponibles."
                );
                return;
            }
            productoExistente.cantidad++;
        } else {

            carrito.push({
                codigo: producto.codigo,
                producto: producto.producto,
                precio: Number(producto.precio) || 0,
                cantidad: 1
            });

        }

        guardarCarrito(carrito);
        alert(producto.producto + " fue agregado al carrito.");
    }


    //botones
    listaProductos.addEventListener("click", event => {
        const boton = event.target.closest(".btn-agregar-carrito");

        if (!boton) {
            return;
        }

        const codigo = boton.dataset.codigo;
        agregarAlCarrito(codigo);
    });


    //actualizaciones de stock
    window.addEventListener("storage", event => {

        if (event.key === "admin_productos") { 
            actualizarStock();
        }
    });
    setInterval(() => {
        actualizarStock();
    }, 1000);
    actualizarStock();
});