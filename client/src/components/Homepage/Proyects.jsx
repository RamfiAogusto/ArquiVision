import React, { useState, useEffect } from "react";
import Proyect from "./Proyect";
import ProyectL from "./ProyectL";

const Proyects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Intentar primero cargar los proyectos desde sessionStorage
        const cachedProjects = sessionStorage.getItem('cachedProjects');
        
        if (cachedProjects) {
            try {
                const parsedProjects = JSON.parse(cachedProjects);
                console.log("Cargando proyectos destacados desde caché:", parsedProjects.length);
                setProjects(parsedProjects);
                setIsLoading(false);
                return;
            } catch (err) {
                console.error("Error al cargar proyectos desde caché:", err);
                // Continuar con la carga normal si hay error
            }
        }
        
        // Si no hay caché o hubo error, cargar desde la API
        fetchProjects();
    }, []);
    
    // Función para cargar proyectos desde la API
    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8080/projects");
            if (!response.ok) {
                throw new Error("Error al obtener proyectos");
            }
            const data = await response.json();
            setProjects(data);
            
            // Guardar los proyectos en sessionStorage para futuras visitas
            sessionStorage.setItem('cachedProjects', JSON.stringify(data));
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
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
