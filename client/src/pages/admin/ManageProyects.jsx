import React from "react";
import Nav from "../../components/admin/Nav";
import ProyectsTable from "../../components/admin/ProyectsTable";
import { Button } from "../../components/ui/button";
import { supabase } from "../../lib/supabase";
import { useProjects } from "../../contexts/ProjectContext";

function ManageProyects() {
  const { refreshProjects, addProject } = useProjects();

  const handleDebug = async () => {
    console.log("🔍 Iniciando depuración de Supabase");
    
    try {
      // Verificar conexión
      console.log("📡 Verificando conexión a Supabase");
      const { count, error: connectionError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
      
      if (connectionError) {
        console.error("❌ Error de conexión:", connectionError);
      } else {
        console.log("✅ Conexión exitosa, número de proyectos:", count);
      }
      
      // Verificar tabla de proyectos
      console.log("📊 Verificando datos de proyectos");
      const { data: projects, error: projectsError } = await supabase.from('projects').select('*');
      
      if (projectsError) {
        console.error("❌ Error al obtener proyectos:", projectsError);
      } else {
        console.log("📋 Proyectos encontrados:", projects);
        
        // Verificar campos
        if (projects && projects.length > 0) {
          const firstProject = projects[0];
          console.log("📑 Estructura del primer proyecto:", {
            ...firstProject,
            campos: Object.keys(firstProject),
            tieneTitle: 'title' in firstProject,
            tieneName: 'name' in firstProject
          });
        }
      }
      
      // Verificar buckets de storage
      console.log("🗄️ Verificando buckets de storage");
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error("❌ Error al listar buckets:", bucketsError);
      } else {
        console.log("📂 Buckets disponibles:", buckets);
      }
      
      console.log("🔄 Actualizando contexto de proyectos");
      await refreshProjects();
      
      console.log("✅ Depuración finalizada");
    } catch (error) {
      console.error("❌ Error durante la depuración:", error);
    }
  };

  const handleCreateTestProject = async () => {
    try {
      console.log("🧪 Creando proyecto de prueba");
      
      const testProject = {
        title: "Proyecto de Prueba " + new Date().toLocaleTimeString(),
        description: "Este es un proyecto de prueba creado automáticamente para verificar la funcionalidad.",
        category: "Prueba",
        status: "active",
        order_position: 0,
        images: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Crear directamente con Supabase para evitar problemas con el contexto
      const { data, error } = await supabase
        .from('projects')
        .insert([testProject])
        .select();
      
      if (error) {
        console.error("❌ Error al crear proyecto de prueba:", error);
      } else {
        console.log("✅ Proyecto de prueba creado:", data);
        await refreshProjects();
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Nav />
      <div className="md:p-8">
        <div className="border-gray-200 border p-4 rounded-lg w-full mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[--primary-color] title-font text-4xl font-medium mb-2">
                Gestión de Proyectos
              </h2>
              <p className="text-gray-500">
                Administra los proyectos de tu portafolio. Aquí puedes crear, editar y eliminar proyectos.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleDebug}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Diagnosticar Conexión
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCreateTestProject}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                Crear Proyecto Prueba
              </Button>
            </div>
          </div>
        </div>
        <ProyectsTable />
      </div>
    </div>
  );
}

export default ManageProyects;
