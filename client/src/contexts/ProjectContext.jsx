import React, { createContext, useState, useContext, useEffect } from "react";
import { getProjects, reorderProjects, deleteProject as deleteProjectFromSupabase } from "../lib/supabase";

// Crear el contexto
const ProjectContext = createContext();

// Hook personalizado para usar el contexto
export const useProjects = () => useContext(ProjectContext);

// Proveedor del contexto
export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Función para ordenar proyectos por order_position
    const sortProjectsByOrderPosition = (projectsArray) => {
        if (!Array.isArray(projectsArray)) return [];
        
        return [...projectsArray].sort((a, b) => {
            // Si ambos tienen order_position, ordenar por ese valor (ascendente)
            if (a.order_position !== null && b.order_position !== null) {
                return a.order_position - b.order_position;
            }
            // Si solo uno tiene order_position, ese va primero
            if (a.order_position !== null) return -1;
            if (b.order_position !== null) return 1;
            // Si ninguno tiene order_position, ordenar por fecha de creación (más reciente primero)
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
    };
    
    // Función para cargar los proyectos
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Intentar primero cargar desde sessionStorage
            const cachedProjects = sessionStorage.getItem('cachedProjects');
            
            if (cachedProjects) {
                try {
                    const parsedProjects = JSON.parse(cachedProjects);
                    console.log("Cargando proyectos desde caché:", parsedProjects.length);
                    setProjects(parsedProjects);
                    setLoading(false);
                    
                    // Actualizar en segundo plano
                    refreshProjectsInBackground();
                    return;
                } catch (err) {
                    console.error("Error al parsear caché:", err);
                    // Continuar con la carga desde Supabase
                }
            }
            
            // Si no hay caché o hubo error, cargar desde Supabase
            const data = await getProjects();
            
            // Ordenar los proyectos
            const sortedProjects = sortProjectsByOrderPosition(data);
            setProjects(sortedProjects);
            
            // Guardar en sessionStorage
            sessionStorage.setItem('cachedProjects', JSON.stringify(sortedProjects));
            
        } catch (err) {
            console.error("Error al cargar proyectos:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Actualizar en segundo plano sin mostrar indicador de carga
    const refreshProjectsInBackground = async () => {
        try {
            const data = await getProjects();
            const sortedProjects = sortProjectsByOrderPosition(data);
            
            setProjects(sortedProjects);
            sessionStorage.setItem('cachedProjects', JSON.stringify(sortedProjects));
        } catch (err) {
            console.error("Error en actualización en segundo plano:", err);
            // No mostrar errores al usuario en actualizaciones en segundo plano
        }
    };
    
    // Función para actualizar el orden de los proyectos
    const updateProjectOrder = async (reorderedProjects) => {
        try {
            // Actualizar los order_position en el array local
            const updatedProjects = reorderedProjects.map((project, index) => ({
                ...project,
                order_position: index
            }));
            
            console.log("Actualizando orden de proyectos:", updatedProjects.map(p => `${p.id}:${p.order_position}`));
            
            // Actualizar el estado inmediatamente para mejorar la UX
            setProjects(updatedProjects);
            
            // Actualizar caché
            sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
            
            // Preparar datos para enviar a Supabase (solo id y order_position)
            const orderData = updatedProjects.map((p, index) => ({
                id: p.id,
                order_position: index
            }));

            console.log("Enviando datos de orden a Supabase:", orderData);
            
            // Enviar los cambios a Supabase
            await reorderProjects(orderData);
            
            console.log("Orden actualizado exitosamente en Supabase");
            return true;
            
        } catch (error) {
            console.error("Error al actualizar el orden:", error);
            return false;
        }
    };
    
    // Función para eliminar un proyecto
    const deleteProject = async (projectId) => {
        try {
            await deleteProjectFromSupabase(projectId);
            
            // Actualizar el estado
            const updatedProjects = projects.filter(p => p.id !== projectId);
            setProjects(updatedProjects);
            
            // Actualizar caché
            sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
            
            return true;
        } catch (error) {
            console.error("Error al eliminar el proyecto:", error);
            return false;
        }
    };
    
    // Cargar proyectos al montar el componente
    useEffect(() => {
        fetchProjects();
    }, []);
    
    // Valor del contexto
    const value = {
        projects,
        loading,
        error,
        fetchProjects,
        refreshProjectsInBackground,
        updateProjectOrder,
        deleteProject,
        setProjects
    };
    
    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
} 