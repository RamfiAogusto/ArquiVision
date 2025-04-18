import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Proyect from "./Proyect";
import ProyectL from "./ProyectL";
import { useProjects } from "../../contexts/ProjectContext";

const Proyects = () => {
    const { projects, loading, error } = useProjects();
    const location = useLocation();
    
    console.log("Proyects - Proyectos recibidos:", projects);
    
    // Guardar la ruta actual como referencia
    useEffect(() => {
        sessionStorage.setItem('projectReferrer', location.pathname);
    }, [location]);
    
    // Filtrar proyectos destacados
    const featuredProjects = projects?.filter(
        (project) => project.featured === true
    ) || [];
    
    console.log("Proyects - Proyectos destacados:", featuredProjects);
    
    if (loading) return <div className="py-16 text-center">Cargando proyectos...</div>;
    if (error) return <div className="py-16 text-center">Error al cargar proyectos</div>;
    
    if (!featuredProjects || featuredProjects.length === 0) {
        console.log("Proyects - No hay proyectos destacados, mostrando todos los proyectos");
        return (
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Proyectos</h2>
                    <div className="space-y-12">
                        {projects?.map((project, index) => (
                            index % 2 === 0 ? (
                                <Proyect key={project.id} proyecto={project} />
                            ) : (
                                <ProyectL key={project.id} proyecto={project} />
                            )
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Proyectos Destacados</h2>
                <div className="space-y-12">
                    {featuredProjects.map((project, index) => (
                        index % 2 === 0 ? (
                            <Proyect key={project.id} proyecto={project} />
                        ) : (
                            <ProyectL key={project.id} proyecto={project} />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Proyects;
