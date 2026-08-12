//Almacenamos la Url del endpoint
const API_URL = "https://retoolapi.dev/2H1WTH/Usuarios"

//Funcion para obtener los datos con get
export async function getUsers() {
    try {
        const respuesta = await fetch(API_URL);

        if(!respuesta.ok){
            throw new Error("Error al obtener los Usuarios")
        }
        const usuarios = await respuesta.json();
        return usuarios;
        
    } catch (error) {
        console.error("Error al cargar usuarios")
        throw error;
    }
}

export async function createUsers(usuarios) {
    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarios)
        });

        if(!respuesta.ok) {
            throw new Error("Error al crear usuario");
        }

        const nuevoUsuario = await respuesta.json();
        return nuevoUsuario; //Retorna los datos de las personas creadas
    }
    catch(error) {
        console.error("Error al crear el usuario: " + error);
        throw error;
    }
}

export async function deleteUser(id) {
    try{
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if(!respuesta.ok) {
            throw new Error('Error al eliminar el usuario');
        }

        return true; //Avisamos al controllers que sí se eliminó
    }
    catch(error){
        console.error("Error al eliminar a el usuario: " + error);
        throw error;
    }
}

export async function getUser(id){
    try{
        //Llamada a la API
        const respuesta = await fetch(`${API_URL}/${id}`); //Get por defecto

        //Validamos si hubo error en la llamada a la API
        if(!respuesta.ok){
            throw new Error("Error al obtener el Usuario")
        }
        const usuarios = await respuesta.json();//Convertimos a json
        return usuarios; //Enviamos el Json al controller
    }
    catch(error){
        console.error("Error al cargar a el usuario")
        throw error; // Propagar la excepcion al siguiente try-catch
    }
}

export async function updateUser(id, usuario) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(usuario)
        })

        if(!respuesta.ok) {
            throw new Error("Error al actualizar el usuario" + respuesta.statusText);
        }

        const usuarioActualizado = await respuesta.json();
        return usuarioActualizado; //Retornar la persona actualizada al controller
    } 
    catch (error) {
        console.error(error);
    }
}


