document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.querySelector("form");
    const inputUsuario = document.getElementById("username");
    const inputPassword = document.getElementById("password");

    if (!formulario) {
        return;
    }

    const sesionExistente = obtenerSesion();

    if (sesionExistente) {
        mostrarMensaje(
            `Ya tienes una sesión iniciada como
            <strong>${sesionExistente.nombre}</strong>.`,
            "info"
        );
        return;
    }

    //login

    formulario.addEventListener("submit", event => {

        event.preventDefault();

        const nombreUsuario = inputUsuario.value.trim().toLowerCase();
        const password =inputPassword.value;

        if (!nombreUsuario || !password) {
            mostrarMensaje("Debes ingresar usuario y contraseña.","danger");
            return;
        }

        //obtener usuarios registrados por admin
        let usuarios = [];
        try {

            usuarios =JSON.parse(localStorage.getItem("admin_usuarios")) || [];

        } catch (error) {
            console.error("Error leyendo usuarios:",error);
            usuarios = [];
        }

        //buscar usuario
        const usuarioEncontrado =
            usuarios.find(usuario =>
                usuario.usuario.toLowerCase() ===
                nombreUsuario
            );


        //usuario inexistente
        if (!usuarioEncontrado) {
            mostrarMensaje("El usuario o la contraseña son incorrectos.","danger");
            return;
        }

       //login
        const passwordUsuario = usuarioEncontrado.password || "1234"
        if (password !== passwordUsuario) {
            mostrarMensaje(
                "El usuario o la contraseña son incorrectos.",
                "danger"
            );
            return;
        }

        iniciarSesion(usuarioEncontrado);

        mostrarMensaje(
            `Bienvenido/a, <strong>${usuarioEncontrado.nombre}</strong>.`,
            "success"
        );

        //redirecciones
        setTimeout(() => {
            const rol =
                usuarioEncontrado.rol.toLowerCase();

            //administrador
            if (rol === "administrador") {
                window.location.href = "admin.html";
                return;
            }

            //vendedor
            if (rol === "vendedor") {
                window.location.href = "vendedor.html";
                return;
            }

            //cliente/usuario/contratista
            if (
                rol === "cliente" ||
                rol === "usuario" ||
                rol === "contratista"
            ) {
                window.location.href = "index.html";
                return;
            }

            //desconocido
            window.location.href = "index.html";
        }, 800);
    });

    //mensaje

    function mostrarMensaje(mensaje, tipo) {

        let contenedor = document.getElementById("mensajeLogin");

        if (!contenedor) {
            contenedor = document.createElement("div");
            contenedor.id = "mensajeLogin";
            formulario.prepend(contenedor);
        }


        contenedor.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensaje}
                                </div>
        `;
    }
});