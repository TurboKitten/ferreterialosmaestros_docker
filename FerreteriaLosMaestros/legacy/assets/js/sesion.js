//USUARIO INICIAL, PARA QUE SIEMPRE HAYA UN ADMINISTRADOR
const USUARIOS_INICIALES = [
    {
        nombre: "Administrador",
        usuario: "admin",
        rol: "Administrador",
        estado: "Activo",
        password: "admin123"
    }
];

function inicializarUsuarios() {
    if (!localStorage.getItem("admin_usuarios")) {
        localStorage.setItem("admin_usuarios", JSON.stringify(USUARIOS_INICIALES));
    }
}

function obtenerSesion() {
    const sesion = localStorage.getItem("sesionActiva");
    if (!sesion) {
        return null;
    }
    try {
        return JSON.parse(sesion);
    } catch (error) {
        console.error("Error al leer la sesión:", error);
        return null;
    }
}

//iniciar sesión
function iniciarSesion(usuario) {
    localStorage.setItem(
        "sesionActiva",
        JSON.stringify({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            rol: usuario.rol
        })
    );
}

//cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "index.html";
}

//comprobar si hay sesión
function haySesion() {
    return obtenerSesion() !== null;
}

//obtener el rol actual
function obtenerRol() {
    const sesion = obtenerSesion();
    if (!sesion) {
        return null;
    }
    return sesion.rol;
}

//paginas

function protegerPagina(rolPermitido) {

    const sesion = obtenerSesion();

    //comprobacion de rol/sesion
    if (!sesion) {
        window.location.href = "login.html";
        return false;
    }

    if (rolPermitido) {
        const rolesPermitidos = Array.isArray(rolPermitido)
            ? rolPermitido
            : [rolPermitido];
        if (!rolesPermitidos.includes(sesion.rol)) {
            //usuario sin permiso
            window.location.href = "index.html";
            return false;
        }
    }
    return true;
}

//cerrar sesion

document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuarios();

    const botonesCerrarSesion = document.querySelectorAll("[data-cerrar-sesion]");

    botonesCerrarSesion.forEach(boton => {
        boton.addEventListener("click", event => {
            event.preventDefault();
            cerrarSesion();
        });
    });
});