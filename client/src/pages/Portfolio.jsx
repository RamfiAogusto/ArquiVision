import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Proyect from "../components/Homepage/Proyect";
import Footer from "../components/Homepage/Footer";
import ProyectL from "../components/Homepage/ProyectL";
import Loader from "../components/Loader";
import { useProjects } from "../contexts/ProjectContext";
import Nav from "../components/Nav";
import GalleryProyects from "../components/PortfolioPage/GalleryProyects";

const Portfolio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { projects, loading, error } = useProjects();
    
    // Guardar la ruta actual como referencia
    useEffect(() => {
        sessionStorage.setItem('projectReferrer', location.pathname);
    }, [location]);
    
    if (loading) {
        return (
            <div>
                <Nav />
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-xl">Cargando proyectos...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Nav />
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-xl text-red-600">Error al cargar los proyectos: {error}</p>
                </div>
                <Footer />
            </div>
        );
    }
    
    console.log("Portfolio - Vamos a mostrar:", {
        proyectosPrincipales: projects.length > 0 ? projects[0].name : "Ninguno",
        proyectosSecundarios: projects.length > 1 ? projects[1].name : "Ninguno",
        proyectosGaleria: projects.length > 2 ? projects.slice(2).length : 0
    });
    
    return (
        <div>
            <Nav />
            
            {/* Proyectos principales */}
            {projects.length > 0 && <Proyect proyecto={projects[0]} />}
            {projects.length > 1 && <ProyectL proyecto={projects[1]} />}
            
            {/* Galería de proyectos restantes */}
            {projects.length > 2 && <GalleryProyects projects={projects.slice(2)} />}
            
            {/* Mensaje si no hay proyectos */}
            {projects.length === 0 && (
                <div className="container mx-auto px-4 py-24 text-center">
                    <p className="text-xl text-gray-500">No hay proyectos disponibles.</p>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default Portfolio;
