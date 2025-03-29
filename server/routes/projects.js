const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/upload.js');
const { createProject, getProjects, getProjectById, deleteProject } = require('../controllers/projectController.js');

console.log("🔍 Cargando módulo routes/projects.js");

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

// Solo usar getProjectById si existe
router.get('/:id', getProjectById || ((req, res) => {
    console.error("⚠️ getProjectById no está definida");
    res.status(500).json({ error: "Función no implementada" });
}));

// Solo usar deleteProject si existe
router.delete('/:id', deleteProject || ((req, res) => {
    console.error("⚠️ deleteProject no está definida");
    res.status(500).json({ error: "Función no implementada" });
}));

module.exports = router;
