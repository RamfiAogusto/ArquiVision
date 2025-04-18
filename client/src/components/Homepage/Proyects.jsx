import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Proyect from "./Proyect";
import ProyectL from "./ProyectL";
import { useProjects } from "../../contexts/ProjectContext";

const Proyects = () => {
    const { projects, loading, error } = useProjects();
    const location = useLocation();
    
    // Guardar la ruta actual como referencia
    useEffect(() => {
        sessionStorage.setItem('projectReferrer', location.pathname);
    }, [location]);
    
    // Filtrar proyectos destacados
    const featuredProjects = projects.filter(
        (project) => project.featured === true
    );
    
    if (loading) return <div className="py-16 text-center">Cargando proyectos...</div>;
    if (error) return <div className="py-16 text-center">Error al cargar proyectos</div>;
    
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
