import React from "react";
import Proyect from "./Proyect";
import ProyectL from "./ProyectL";
import { useProjects } from "../../contexts/ProjectContext";

const Proyects = () => {
    const { projects, loading } = useProjects();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <p className="text-xl">Cargando proyectos destacados...</p>
            </div>
        );
    }
    
    return (
        <div>
            {projects.length > 0 && <Proyect project={projects[0]} />}
            {projects.length > 1 && <ProyectL project={projects[1]} />}
        </div>
    );
};

export default Proyects;
