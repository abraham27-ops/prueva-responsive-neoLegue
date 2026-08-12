import { getUsers, getUser, createUsers, updateUser, deleteUser } from "../Services/GestionUsuarioServices.JS";

//Elementos de la lista
const tablaUsuarios = document.getElementById("tablaUsuarios");
const contadorUsuarios = document.getElementById("contadorUsuarios");
const filtrosRol = document.getElementById("filtrosRol");

//Elementos del modal de creación / edición
const modalCrearUsuarioEl = document.getElementById("modalCrearUsuario");
const modalCrearUsuario = new bootstrap.Modal(modalCrearUsuarioEl);
const modalTitulo = document.getElementById("modalCrearUsuarioLabel");

const frmCrearUsuario = document.getElementById("frmCrearUsuario");
const idUsuarioModal = document.getElementById("idUsuarioModal");

const txtNombres = document.getElementById("txtNombres");
const txtApellidos = document.getElementById("txtApellidos");
const txtCorreo = document.getElementById("txtCorreo");
const selectRol = document.getElementById("selectRol");
const selectTipoUsuario = document.getElementById("selectTipoUsuario");
const txtDui = document.getElementById("txtDui");

const btnGuardarUsuario = document.getElementById("btnGuardarUsuario");
const btnAbrirModalCrear = document.getElementById("btnAbrirModalCrear");

//Elementos de la foto (solo vista previa en el navegador)
const fotoDropzone = document.getElementById("fotoDropzone");
const inputFoto = document.getElementById("inputFoto");
const fotoPreview = document.getElementById("fotoPreview");
const fotoIcono = document.getElementById("fotoIcono");
const fotoTexto = document.getElementById("fotoTexto");

//Búsqueda
const frmUsuarios = document.getElementById("frmUsuarios");
const txtNombreUsuario = document.getElementById("txtNombreUsuario");

const mensaje = document.getElementById("mensaje");

let usuariosCache = []; //Última lista traída de la API
let rolActivo = "";      //Chip de rol seleccionado ("" = Todos)

//Clases de badge según el rol (deben existir en NeoLeague.css)
const BADGE_POR_ROL = {
    Administrador: "nl-badge-admin",
    Entrenador: "nl-badge-entrenador",
    Estudiante: "nl-badge-estudiante",
};

//----- Utilidades -----

function mostrarMensaje(texto, tipo = "success") {
    if (typeof Swal !== "undefined") {
        Swal.fire({
            icon: tipo === "danger" ? "error" : "success",
            title: texto,
            timer: 2200,
            showConfirmButton: false,
        });
        return;
    }
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo}`;
    setTimeout(() => mensaje.classList.add("d-none"), 3000);
}

function iniciales(nombre = "", apellido = "") {
    const n = nombre.trim().charAt(0);
    const a = apellido.trim().charAt(0);
    return `${n}${a}`.toUpperCase() || "?";
}

function claseBadge(rol) {
    return BADGE_POR_ROL[rol] || "nl-badge-default";
}

//----- Pintado de la lista -----

function pintarUsuarios(usuarios) {
    if (!usuarios || usuarios.length === 0) {
        tablaUsuarios.innerHTML = `<div class="nl-empty">No se encontraron usuarios con ese criterio.</div>`;
        contadorUsuarios.textContent = "0 usuarios";
        return;
    }

    let html = "";
    usuarios.forEach((usuario) => {
        html += `
            <div class="nl-row-card">
                <div class="nl-avatar">${iniciales(usuario.nombre || "", usuario.apellido || "")}</div>
                <div class="flex-grow-1" style="min-width:0">
                    <p class="nl-row-title text-truncate">${usuario.nombre || ""} ${usuario.apellido || ""}</p>
                    <p class="nl-row-subtitle text-truncate">${usuario.correo || usuario.dui || ""}</p>
                </div>
                <span class="nl-badge ${claseBadge(usuario.rol)}">${usuario.rol || "Sin rol"}</span>
                <div class="nl-row-actions d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill me-1" title="Editar" onclick="editarUsuario(${usuario.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-pill" title="Eliminar" onclick="borrarUsuario(${usuario.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    tablaUsuarios.innerHTML = html;
    contadorUsuarios.textContent = `${usuarios.length} usuario${usuarios.length === 1 ? "" : "s"}`;
}

//Aplica el chip de rol + el texto del buscador sobre la caché y pinta el resultado
function aplicarFiltros() {
    try {
        const texto = txtNombreUsuario.value.trim().toLowerCase();

        const filtrados = usuariosCache.filter((usuario) => {
            const coincideRol = rolActivo === "" || usuario.rol === rolActivo;
            const cadenaFiltro = `${usuario.nombre || ""} ${usuario.apellido || ""} ${usuario.dui || ""} ${usuario.rol || ""}`.toLowerCase();
            const coincideTexto = texto === "" || cadenaFiltro.includes(texto);
            return coincideRol && coincideTexto;
        });

        pintarUsuarios(filtrados);
    } catch (e) {
        console.error("Error al aplicar filtros:", e);
    }
}

//Función para traer y mostrar los usuarios desde la API
async function mostrarUsuarios() {
    try {
        usuariosCache = await getUsers();
        aplicarFiltros();
    } catch (error) {
        mostrarMensaje("No se pudieron cargar los usuarios", "danger");
    }
}

document.addEventListener("DOMContentLoaded", mostrarUsuarios);

//Buscador (evita el submit y solo filtra)
frmUsuarios.addEventListener("submit", (e) => e.preventDefault());
txtNombreUsuario.addEventListener("input", aplicarFiltros);

//Chips de filtro por rol
filtrosRol.addEventListener("click", (e) => {
    const chip = e.target.closest(".nl-chip");
    if (!chip) return;

    filtrosRol.querySelectorAll(".nl-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    rolActivo = chip.dataset.rol;
    aplicarFiltros();
});

//----- Lógica del modal de Crear / Editar Usuario -----

btnAbrirModalCrear.addEventListener("click", limpiarFormularioModal);

function limpiarFormularioModal() {
    frmCrearUsuario.reset();

    idUsuarioModal.value = "";
    modalTitulo.textContent = "Crear Usuario";
    btnGuardarUsuario.textContent = "AGREGAR";

    fotoPreview.classList.add("d-none");
    fotoPreview.src = "";
    fotoIcono.classList.remove("d-none");
    fotoTexto.classList.remove("d-none");
}

async function editarUsuario(id) {
    try {
        const usuario = await getUser(id);

        idUsuarioModal.value = usuario.id;
        txtNombres.value = usuario.nombre ?? "";
        txtApellidos.value = usuario.apellido ?? "";
        txtCorreo.value = usuario.correo ?? "";
        selectRol.value = usuario.rol ?? "";
        selectTipoUsuario.value = usuario.tipoUsuario ?? "";
        txtDui.value = usuario.dui ?? "";

        modalTitulo.textContent = "Editar Usuario";
        btnGuardarUsuario.textContent = "ACTUALIZAR";

        modalCrearUsuario.show();
    } catch (error) {
        mostrarMensaje("No se pudo cargar el usuario para editar", "danger");
    }
}

async function borrarUsuario(id) {
    if (typeof Swal !== "undefined") {
        const resultado = await Swal.fire({
            title: "¿Eliminar este usuario?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#de4537",
        });
        if (!resultado.isConfirmed) return;
    } else if (!confirm("¿Desea eliminar este usuario?")) {
        return;
    }

    try {
        await deleteUser(id);
        mostrarMensaje("Usuario eliminado correctamente");
        await mostrarUsuarios();
    } catch (error) {
        mostrarMensaje("No se pudo eliminar el usuario", "danger");
    }
}

//Vista previa de la foto seleccionada (solo en el navegador, no se envía a la API)
fotoDropzone.addEventListener("click", () => inputFoto.click());

inputFoto.addEventListener("change", () => {
    const archivo = inputFoto.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
        fotoPreview.src = lector.result;
        fotoPreview.classList.remove("d-none");
        fotoIcono.classList.add("d-none");
        fotoTexto.classList.add("d-none");
    };
    lector.readAsDataURL(archivo);
});

//Envío del formulario: crea o actualiza según si hay ID
frmCrearUsuario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = idUsuarioModal.value.trim();

    const usuario = {
        nombre: txtNombres.value.trim(),
        apellido: txtApellidos.value.trim(),
        correo: txtCorreo.value.trim(),
        rol: selectRol.value,
        tipoUsuario: selectTipoUsuario.value,
        dui: txtDui.value.trim(),
    };

    try {
        if (id !== "") {
            await updateUser(id, usuario);
            mostrarMensaje("Usuario actualizado correctamente");
        } else {
            await createUsers(usuario);
            mostrarMensaje("Usuario creado correctamente");
        }

        modalCrearUsuario.hide();
        limpiarFormularioModal();
        await mostrarUsuarios();
    } catch (error) {
        mostrarMensaje("No se pudo guardar el usuario", "danger");
    }
});

modalCrearUsuarioEl.addEventListener("hidden.bs.modal", limpiarFormularioModal);

//Exponemos las funciones que se llaman desde los botones generados en el HTML
window.editarUsuario = editarUsuario;
window.borrarUsuario = borrarUsuario;
