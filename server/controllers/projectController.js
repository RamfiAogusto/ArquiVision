const { createNewProject, getAllProjects, getProject, removeProject } = require('../services/projectService.js');
const supabase = require('../supabaseClient.js');

const getProjects = async (req, res) => {
    try {
        console.log("📋 Obteniendo todos los proyectos");
        const projects = await getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('❌ Error en getProjects:', error);
        res.status(500).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando proyecto con ID: ${id}`);
        const project = await getProject(id);
        
        if (!project) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        
        res.status(200).json(project);
    } catch (error) {
        console.error('❌ Error en getProjectById:', error);
        res.status(500).json({ error: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        console.log("📁 Iniciando createProject");
        console.log("📁 Body recibido:", req.body);
        console.log("📁 Archivos recibidos:", req.files ? req.files.length : 0);
        
        const { name, description, location, size, intention, client } = req.body;
        const images = req.files || [];

        // Validación de campos
        if (!name || !description || !location || !size || !intention || !client) {
            console.log("❌ [CONTROLLER] Validación fallida, faltan campos");
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!description) missingFields.push('description');
            if (!location) missingFields.push('location');
            if (!size) missingFields.push('size');
            if (!intention) missingFields.push('intention');
            if (!client) missingFields.push('client');
            
            return res.status(400).json({
                error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
            });
        }

        console.log("📁 [CONTROLLER] Llamando a createNewProject con imágenes:", images.length);
        const result = await createNewProject(
            name,
            description,
            location,
            size,
            intention,
            client,
            images
        );

        console.log("✅ [CONTROLLER] Proyecto creado exitosamente");
        res.status(201).json(result);
    } catch (error) {
        console.error('❌ Error en createProject:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Eliminando proyecto con ID: ${id}`);
        await removeProject(id);
        res.status(200).json({ message: "Proyecto eliminado correctamente" });
    } catch (error) {
        console.error('❌ Error en deleteProject:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, size, intention, client, currentImages } = req.body;
        const newImages = req.files;
        
        let imageUrls = JSON.parse(currentImages || '[]');

        // Subir nuevas imágenes si existen
        if (newImages && newImages.length > 0) {
            const newImageUrls = await Promise.all(
                newImages.map(image => uploadImage(image))
            );
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        const { data, error } = await supabase
            .from('projects')
            .update({
                name,
                description,
                location,
                size: parseInt(size),
                intention,
                client,
                images: imageUrls
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    deleteProject,
    updateProject
};
