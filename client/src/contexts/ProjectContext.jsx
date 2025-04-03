import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getProjects, createProject, updateProject, deleteProject } from '../lib/supabase';

// Crear el contexto
const ProjectContext = createContext();

// Hook personalizado para usar el contexto
export function useProjects() {
  return useContext(ProjectContext);
}

// Proveedor del contexto
export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar proyectos
  const loadProjects = async () => {
    try {
      console.log('🔄 Iniciando carga de proyectos...');
      setLoading(true);
      
      // Verificar conexión a Supabase
      const { count, error: healthError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      if (healthError) {
        console.error('❌ Error de conexión a Supabase:', healthError);
        throw healthError;
      }
      console.log('✅ Conexión a Supabase establecida correctamente', { count });
      
      const data = await getProjects();
      console.log('📋 Proyectos cargados:', data);
      setProjects(data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error al cargar proyectos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear proyecto
  const addProject = async (projectData) => {
    try {
      console.log('➕ Creando nuevo proyecto:', projectData);
      const newProject = await createProject(projectData);
      console.log('✅ Proyecto creado:', newProject);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      console.error('❌ Error al crear proyecto:', err);
      throw err;
    }
  };

  // Actualizar proyecto
  const updateProjectData = async (id, projectData) => {
    try {
      console.log('🔄 Actualizando proyecto:', id, projectData);
      const updatedProject = await updateProject(id, projectData);
      console.log('✅ Proyecto actualizado:', updatedProject);
      setProjects(prev =>
        prev.map(project => project.id === id ? updatedProject : project)
      );
      return updatedProject;
    } catch (err) {
      console.error('❌ Error al actualizar proyecto:', err);
      throw err;
    }
  };

  // Eliminar proyecto
  const deleteProjectData = async (id) => {
    try {
      console.log('🗑️ Eliminando proyecto:', id);
      await deleteProject(id);
      console.log('✅ Proyecto eliminado');
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      console.error('❌ Error al eliminar proyecto:', err);
      throw err;
    }
  };

  // Cargar proyectos al montar el componente
  useEffect(() => {
    console.log('🚀 Iniciando ProjectContext');
    loadProjects();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    console.log('📡 Configurando suscripción a cambios en tiempo real');
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('🔔 Cambio detectado:', payload);
          loadProjects(); // Recargar proyectos cuando hay cambios
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value = {
    projects,
    loading,
    error,
    refreshProjects: loadProjects,
    addProject,
    updateProject: updateProjectData,
    deleteProject: deleteProjectData,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
} 