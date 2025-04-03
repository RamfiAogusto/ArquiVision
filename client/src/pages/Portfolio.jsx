import React from "react";
import Proyect from "../components/PortfolioPage/Proyect";
import Nav from "../components/Nav";
import Footer from "../components/Homepage/Footer";
import ProyectL from "../components/PortfolioPage/ProyectL";
import GalleryProyects from "../components/PortfolioPage/GalleryProyects";
import { useProjects } from "../contexts/ProjectContext";

const Portfolio = () => {
    const { projects, loading, error } = useProjects();
    
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

    return (
        <div>
            <Nav />
            {projects.length > 0 && <Proyect project={projects[0]} />}
            {projects.length > 1 && <ProyectL project={projects[1]} />}
            {projects.length > 2 && <GalleryProyects projects={projects.slice(2)} />}
            <Footer />
        </div>
    );
};

export default Portfolio;
