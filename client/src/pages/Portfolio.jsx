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
                setProjects(parsedProjects);
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
    
    // Función para actualizar en segundo plano sin mostrar carga
    const refreshProjectsInBackground = async () => {
        try {
            const response = await fetch("http://localhost:8080/projects");
            if (!response.ok) return;
            
            const data = await response.json();
            // Actualizar solo si hay cambios (comparando longitud por simplicidad)
            if (JSON.stringify(data) !== sessionStorage.getItem('cachedProjects')) {
                console.log("Actualizando proyectos con datos nuevos");
                setProjects(data);
                sessionStorage.setItem('cachedProjects', JSON.stringify(data));
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
                    <GalleryProyects projects={projects.slice(2)} />
                </>
            )}
            <Footer />
        </div>
    );
};

export default Portfolio;
