// ============================================================================
// SERVICIO DE GESTIÓN DE CATEGORÍAS – NeoLeague
// CRUD de categorías oficiales con edad mínima y máxima (persistente en localStorage)
// ============================================================================

const STORAGE_KEY_CATEGORIAS = 'nl_categorias_oficiales';

// Datos iniciales institucionales si no hay nada en localStorage
const CATEGORIAS_DEFAULT = [
    { id: 1, nombre: 'Sub-15 (Infantil)', edadMinima: 13, edadMaxima: 15 },
    { id: 2, nombre: 'Sub-18 (Juvenil)', edadMinima: 16, edadMaxima: 18 },
    { id: 3, nombre: 'Libre (Universitario / Mayor)', edadMinima: 18, edadMaxima: 35 },
    { id: 4, nombre: 'Femenino Sub-17', edadMinima: 14, edadMaxima: 17 }
];

// Obtener todas las categorías
export async function getCategorias() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let data = JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORIAS));
            if (!data || data.length === 0) {
                data = [...CATEGORIAS_DEFAULT];
                localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(data));
            }
            resolve(data);
        }, 150);
    });
}

// Obtener una categoría por ID
export async function getCategoria(id) {
    const categorias = await getCategorias();
    const found = categorias.find(c => c.id === parseInt(id, 10));
    if (!found) throw new Error('Categoría no encontrada');
    return found;
}

// Crear nueva categoría
export async function createCategorias(nuevaCategoria) {
    const categorias = await getCategorias();
    const maxId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) : 0;
    const catConId = {
        id: maxId + 1,
        nombre: nuevaCategoria.nombre,
        edadMinima: parseInt(nuevaCategoria.edadMinima, 10),
        edadMaxima: parseInt(nuevaCategoria.edadMaxima || nuevaCategoria.EdadMaxima, 10)
    };
    categorias.push(catConId);
    localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(categorias));
    return catConId;
}

// Actualizar categoría existente
export async function updateCategoria(id, datosActualizados) {
    const categorias = await getCategorias();
    const index = categorias.findIndex(c => c.id === parseInt(id, 10));
    if (index === -1) throw new Error('No se puede actualizar, ID no encontrado');
    
    categorias[index] = {
        ...categorias[index],
        nombre: datosActualizados.nombre,
        edadMinima: parseInt(datosActualizados.edadMinima, 10),
        edadMaxima: parseInt(datosActualizados.edadMaxima || datosActualizados.EdadMaxima, 10)
    };
    localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(categorias));
    return categorias[index];
}

// Eliminar categoría
export async function deleteCategoria(id) {
    let categorias = await getCategorias();
    categorias = categorias.filter(c => c.id !== parseInt(id, 10));
    localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(categorias));
    return true;
}
