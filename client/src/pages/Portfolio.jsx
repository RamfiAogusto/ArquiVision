import React, { useState, useEffect } from "react";
import Proyect from "../components/PortfolioPage/Proyect";
import Nav from "../components/Nav";
import Footer from "../components/Homepage/Footer";
import ProyectL from "../components/PortfolioPage/ProyectL";
import GalleryProyects from "../components/PortfolioPage/GalleryProyects";

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Intentar primero cargar los proyectos desde sessionStorage
        const cachedProjects = sessionStorage.getItem('cachedProjects');
        
        if (cachedProjects) {
            try {
                const parsedProjects = JSON.parse(cachedProjects);
                console.log("Cargando proyectos desde caché:", parsedProjects.length);
                // Ordenar los proyectos por order_position
                const sortedProjects = sortProjectsByOrderPosition(parsedProjects);
                setProjects(sortedProjects);
                setIsLoading(false);
                
                // Opcional: Actualizar en segundo plano
                refreshProjectsInBackground();
                return;
            } catch (err) {
                console.error("Error al cargar proyectos desde caché:", err);
                // Continuar con la carga normal si hay error
            }
        }
        
        // Si no hay caché o hubo error, cargar desde la API
        fetchProjects();
    }, []);
    
    // Función para ordenar proyectos por order_position
    const sortProjectsByOrderPosition = (projectsArray) => {
        if (!Array.isArray(projectsArray)) return [];
        
        // Crear una copia para no modificar el original
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
    
    // Función para cargar proyectos desde la API
    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:8080/projects");
            if (!response.ok) {
                throw new Error("Error al obtener proyectos");
            }
            const data = await response.json();
            
            // Ordenar los proyectos por order_position
            const sortedProjects = sortProjectsByOrderPosition(data);
            setProjects(sortedProjects);
            
            // Guardar los proyectos ordenados en sessionStorage para futuras visitas
            sessionStorage.setItem('cachedProjects', JSON.stringify(sortedProjects));
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para actualizar en segundo plano sin mostrar carga
    const refreshProjectsInBackground = async () => {
        try {
            const response = await fetch("http://localhost:8080/projects");
            if (!response.ok) return;
            
            const data = await response.json();
            const sortedData = sortProjectsByOrderPosition(data);
            
            // Actualizar solo si hay cambios
            const currentCache = sessionStorage.getItem('cachedProjects');
            if (JSON.stringify(sortedData) !== currentCache) {
                console.log("Actualizando proyectos con datos nuevos ordenados");
                setProjects(sortedData);
                sessionStorage.setItem('cachedProjects', JSON.stringify(sortedData));
            }
        } catch (error) {
            console.error("Error en actualización en segundo plano:", error);
        }
    };
    
    return (
        <div>
            <Nav />
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-xl">Cargando proyectos...</p>
                </div>
            ) : (
                <>
                    {projects.length > 0 && <Proyect project={projects[0]} />}
                    {projects.length > 1 && <ProyectL project={projects[1]} />}
                    {projects.length > 2 && <GalleryProyects projects={projects.slice(2)} />}
                </>
            )}
            <Footer />
        </div>
    );
};

export default Portfolio;
