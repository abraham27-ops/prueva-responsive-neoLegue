import { getCategoria, getCategorias, createCategorias, updateCategoria, deleteCategoria } from "../Services/GestionCategoriasServices.JS";

const tablaCategorias = document.getElementById("tablaCategorias");

const frmCategoria = document.getElementById("frmCategorias");
const txtNombre = document.getElementById("txtCategoria");
const txtEdadMinima = document.getElementById("txtEdadMinima");
const txtEdadMaxima = document.getElementById("txtEdadMaxima");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const idCategoria = document.getElementById("idCategoria");

//Funcion para mostrar las categorias en la tabla 
async function mostrarCategorias() {
    try {

        const categorias = await getCategorias();

        tablaCategorias.innerHTML = "";

        categorias.forEach((categoria) => {
            tablaCategorias.innerHTML += `
             <tr>
                <td>${categoria.id}</td>
                <td>${categoria.nombre}</td>
                <td>${categoria.edadMinima}</td>
                <td>${categoria.EdadMaxima}</td>
                <td>
                <button class="btn btn-danger btn-sm mb-2" onclick="borrarCategoria(${categoria.id})">Eliminar 🗑</button>
                <button class="btn btn-warning btn-sm" onclick="colocarDatosFormulario(${categoria.id})">Editar 🖊</button>
                </td>
            </tr>
            `;
        });
    } catch (error) {
        alert("No se pudieron cargar las categorías" + error)
    }

}

//EventListener para detectar si toda la pagina ya cargo
document.addEventListener("DOMContentLoaded", async function(){await mostrarCategorias()} );

//Función para crear un nuevo registro
frmCategoria.addEventListener("submit", async function(e){
    e.preventDefault(); //Evita que el formulario se envie

    const id = idCategoria.value.trim(); // <--
    const name = txtNombre.value.trim();
    const edadMinima = txtEdadMinima.value.trim();
    const edadMaxima = txtEdadMaxima.value.trim();

    if(name == "" || edadMinima == "" || edadMaxima == ""){
        alert("Debes llenar todos los campos");
        return; //Para evitar el envio de los datos
    }

    //Objeto que se enviará a la API
    const categoria = {
        nombre: name,
        edadMinima: edadMinima,
        EdadMaxima: edadMaxima,
    }
    
    try{
        //Si el ID no esta vacío, estamos editando
        if (id != "") {
            await updateCategoria(id, categoria);
            alert("La categoría se ha actualizado correctamente");
        }

        //Si el ID está vacio
        else {
            await createCategorias(categoria); //Se envía el objeto al Service para ir a la API
            alert("La categoría ha sido creada");
        }

        //Resetear el formulario
        limpiarFormulario();

        //Recargar la lista
        await mostrarCategorias();
    }
    catch(error){
        alert("No se pudo guardar la categoría " + error)
    }
}
);

function limpiarFormulario() {
    frmCategoria.reset(); //Borrar los valores de los campos

    idCategoria.value = ""; //Vaciamos el ID para evitar errores
    btnGuardar.textContent = "Guardar Categoria";//Restaurar botón de guardar
    btnCancelar.classList.add("d-none"); //Escondemos de nuevo el botón
}

//Enlazar el botón de cancelar con limpiarFormulario
btnCancelar.addEventListener("click", limpiarFormulario);

//Funcion para borrar a una persona
async function borrarCategoria(id) {
    const confirmar = confirm("¿Desea eliminar esta categoria?"); //Boton para confirmar
    if(!confirmar) {
        return; //Si la persona cancela, entonces detenemos la eliminación
    }

    try{
        await deleteCategoria(id); //1
        alert("Se ha eliminado la categoria exitosamente"); //2
        limpiarFormulario(); //3
        await mostrarCategorias(); //4
    }
    catch(error) {
        alert("No se pudo eliminar la categoria");
    }
}

//Funciòn para cargar los datos de la persona en el formulario y editar
async function colocarDatosFormulario(id) {
    try {
        const categoria = await getCategoria(id); //Traemos los datos de la persona

        //Colocamos los valores que vienen en el JSON dentro del formulario
        idCategoria.value = categoria.idCategoria;
        txtNombre.value = categoria.nombre;
        txtEdadMinima.value = categoria.edadMinima;
        txtEdadMaxima.value = categoria.EdadMaxima;

        btnGuardar.textContent = "Actualizar Categoria"; //Se cambia el texto temporalmente
        btnCancelar.classList.remove("d-none"); //Se remueve el causante de que el boton desaparesca

    } catch (error) {
        alert("Error al cargar los datos de las categorias: " + error);
        console.error(error);
    }
}

window.borrarCategoria = borrarCategoria;
window.colocarDatosFormulario = colocarDatosFormulario; //Hacemos que el html si encuentre la función

