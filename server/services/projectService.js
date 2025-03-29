const supabase = require("../supabaseClient.js");
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadImage = async (image) => {
    try {
        // Asegurarse de que tenemos un buffer
        const imageBuffer = image.buffer;
        const originalName = image.originalname || 'image.jpg';
        
        // Generar un nombre único para la imagen
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `${timestamp}-${randomString}-${originalName}`;
        
        console.log(`🖼️ Subiendo imagen: ${fileName}`);
        
        // Subir la imagen a Supabase
        const { data, error } = await supabase.storage
            .from('projects')
            .upload(fileName, imageBuffer, {
                contentType: image.mimetype || 'image/jpeg'
            });
            
        if (error) {
            console.error('❌ Error al subir a Supabase:', error);
            throw error;
        }
        
        // Obtener la URL pública
        const { data: urlData } = await supabase.storage
            .from('projects')
            .getPublicUrl(fileName);
            
        console.log(`✅ Imagen subida correctamente: ${urlData.publicUrl}`);
        return urlData.publicUrl;
    } catch (error) {
        console.error('❌ Error en uploadImage:', error);
        throw new Error(`Error al subir imagen: ${error.message}`);
    }
};

const fetchAllProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw new Error("Error fetching projects");
    return data;
};

const fetchProjectById = async (id) => {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw new Error("Error fetching project");
    return data;
};

const createNewProject = async (name, description, location, size, intention, client, images = []) => {
    try {
        console.log("Iniciando creación de proyecto con imágenes:", images.length);
        console.log("Valores recibidos:", { name, description, location, size, intention, client });

        // Subir todas las imágenes y obtener sus URLs
        const imageUrls = await Promise.all(
            images.map(image => uploadImage(image))
        );

        console.log("URLs de imágenes generadas:", imageUrls);

        // Asegurarse de que intention sea un string, no un array
        const intentionValue = Array.isArray(intention) ? intention[0] : intention;
        
        // Crear el proyecto con las URLs de las imágenes
        const { data, error } = await supabase
            .from('projects')
            .insert([{
                name,
                description,
                location,
                size: parseInt(size),
                intention: intentionValue,  // Usar el valor extraído
                client,
                images: imageUrls
            }])
            .select();

        if (error) {
            console.error('Error en Supabase Database:', error);
            throw error;
        }

        console.log("Proyecto creado exitosamente:", data);
        return data;
    } catch (error) {
        console.error('Error detallado en createNewProject:', error);
        throw error;
    }
};

const removeProject = async (id) => {
    const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
    if (error) throw new Error("Error deleting project");
    return data;
};

const getAllProjects = async () => {
    try {
        console.log("🔍 Consultando todos los proyectos en Supabase");
        const { data, error } = await supabase
            .from('projects')
            .select('*');
            
        if (error) {
            console.error('Error al obtener proyectos:', error);
            throw error;
        }
        
        console.log(`✅ Proyectos recuperados exitosamente: ${data.length}`);
        return data;
    } catch (error) {
        console.error('Error detallado en getAllProjects:', error);
        throw error;
    }
};

module.exports = {
    fetchAllProjects,
    fetchProjectById,
    createNewProject,
    removeProject,
    getAllProjects,
};
