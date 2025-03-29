const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload.js');
const { createProject, getProjects, getProjectById, deleteProject } = require('../controllers/projectController.js');
const supabase = require('../supabaseClient.js');

console.log("🔍 Cargando módulo routes/projects.js");
console.log('Registrando rutas de proyectos...');

// Middleware de debug para todas las rutas en este router
router.use((req, res, next) => {
    console.log(`🛣️ [ROUTES/PROJECTS.JS] Procesando ruta: ${req.method} ${req.originalUrl}`);
    console.log(`🛣️ [ROUTES/PROJECTS.JS] ¿Body ya procesado? ${req._body ? 'SÍ' : 'NO'}`);
    next();
});

// Verifica que las funciones existan
console.log("🔍 Funciones importadas:", {
    createProject: !!createProject,
    getProjects: !!getProjects,
    getProjectById: !!getProjectById,
    deleteProject: !!deleteProject
});

// Rutas
router.post('/', uploadMiddleware, createProject);

// Solo usar getProjects si existe, de lo contrario usar una función de respaldo
router.get('/', getProjects || ((req, res) => {
    console.error("⚠️ getProjects no está definida");
    res.status(500).json({ error: "Función no implementada" });
}));

// Ruta para actualizar el orden ANTES de /:id
router.post('/reorder', async (req, res) => {
    console.log('Recibida solicitud POST a /projects/reorder');
    try {
        const projectOrders = req.body; // Array de {id, order_position}
        
        // Validar formato de datos
        if (!Array.isArray(projectOrders)) {
            return res.status(400).json({ error: "Se esperaba un array de proyectos" });
        }
        
        console.log('Cuerpo de la solicitud:', projectOrders);
        
        // Actualizar cada proyecto
        for (const item of projectOrders) {
            const { id, order_position } = item;
            
            // Actualizar en la base de datos
            const { error } = await supabase
                .from('projects')
                .update({ order_position })
                .eq('id', id);
                
            if (error) {
                console.error(`Error actualizando el orden del proyecto ${id}:`, error);
                throw error;
            }
        }
        
        res.status(200).json({ message: "Orden actualizado exitosamente" });
    } catch (error) {
        console.error('Error en reorder:', error);
        res.status(500).json({ error: error.message });
    }
});

// Después las rutas con parámetros dinámicos
router.get('/:id', getProjectById || ((req, res) => {
    console.error("⚠️ getProjectById no está definida");
    res.status(500).json({ error: "Función no implementada" });
}));

// Solo usar deleteProject si existe
router.delete('/:id', deleteProject || ((req, res) => {
    console.error("⚠️ deleteProject no está definida");
    res.status(500).json({ error: "Función no implementada" });
}));

console.log('Rutas de proyectos registradas con éxito');

module.exports = router;
