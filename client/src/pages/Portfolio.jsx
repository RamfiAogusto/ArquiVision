import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Proyect from "../components/Homepage/Proyect";
import Footer from "../components/Homepage/Footer";
import ProyectL from "../components/Homepage/ProyectL";
import { LayoutGrid, List, Filter } from "lucide-react";
import ModalF from "../components/ModalF";
import Loader from "../components/Loader";
import { useProjects } from "../contexts/ProjectContext";
import Nav from "../components/Nav";
import GalleryProyects from "../components/PortfolioPage/GalleryProyects";
import { Button } from "../components/ui/button";

const Portfolio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { projects, loading, error } = useProjects();
    const [viewType, setViewType] = useState("grid");
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [filters, setFilters] = useState({
        category: "todos",
        status: "todos",
        area: "todos",
    });
    
    // Guardar la ruta actual como referencia
    useEffect(() => {
        sessionStorage.setItem('projectReferrer', location.pathname);
    }, [location]);
    
    // Aplicar filtros a los proyectos
    useEffect(() => {
        console.log("Portfolio - Proyectos recibidos:", projects);
        
        if (!projects || projects.length === 0) {
            console.log("Portfolio - No hay proyectos para filtrar");
            setFilteredProjects([]);
            return;
        }
        
        // Filtrar los proyectos según los criterios seleccionados
        let filtered = [...projects];
        console.log("Portfolio - Filtros actuales:", filters);
        
        // Filtro por categoría
        if (filters.category !== "todos") {
            console.log("Portfolio - Filtrando por categoría:", filters.category);
            filtered = filtered.filter(p => p.intention === filters.category);
            console.log("Portfolio - Proyectos después de filtrar por categoría:", filtered.length);
        }
        
        // Filtro por estado
        if (filters.status !== "todos") {
            console.log("Portfolio - Filtrando por estado:", filters.status);
            filtered = filtered.filter(p => p.status === filters.status);
            console.log("Portfolio - Proyectos después de filtrar por estado:", filtered.length);
        }
        
        // Filtro por área
        if (filters.area !== "todos") {
            console.log("Portfolio - Filtrando por área:", filters.area);
            filtered = filtered.filter(p => {
                const area = parseInt(p.size) || 0;
                console.log(`Portfolio - Proyecto ${p.id} - Área: ${area}`);
                
                switch (filters.area) {
                    case "small": return area < 100;
                    case "medium": return area >= 100 && area < 500;
                    case "large": return area >= 500 && area < 1000;
                    case "xlarge": return area >= 1000;
                    default: return true;
                }
            });
            console.log("Portfolio - Proyectos después de filtrar por área:", filtered.length);
        }
        
        console.log("Portfolio - Proyectos filtrados finales:", filtered);
        setFilteredProjects(filtered);
    }, [projects, filters]);
    
    // Resetear filtros
    const handleResetFilters = () => {
        setFilters({
            category: "todos",
            status: "todos",
            area: "todos"
        });
    };
    
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
    
    // Determinar qué lista de proyectos usar
    const displayProjects = filteredProjects.length > 0 || Object.values(filters).some(value => value !== "todos") 
        ? filteredProjects 
        : projects;

    console.log("Portfolio - displayProjects:", displayProjects);
    console.log("Portfolio - Vamos a mostrar:", {
        proyectosPrincipales: displayProjects.length > 0 ? displayProjects[0].name : "Ninguno",
        proyectosSecundarios: displayProjects.length > 1 ? displayProjects[1].name : "Ninguno",
        proyectosGaleria: displayProjects.length > 2 ? displayProjects.slice(2).length : 0
    });
    
    return (
        <div>
            <Nav />
            
            {/* Herramientas - Vista y Filtros */}
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Nuestros Proyectos</h1>
                
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => setFilterModalOpen(true)}
                    >
                        <Filter className="h-4 w-4" />
                        Filtrar
                    </Button>
                    
                    <div className="border rounded-md flex">
                        <Button
                            variant={viewType === "grid" ? "default" : "ghost"}
                            className="p-2"
                            onClick={() => setViewType("grid")}
                            aria-label="Vista de cuadrícula"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewType === "list" ? "default" : "ghost"}
                            className="p-2"
                            onClick={() => setViewType("list")}
                            aria-label="Vista de lista"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Modal para filtros */}
            <ModalF 
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onChange={setFilters}
                onApply={(newFilters) => setFilters(newFilters)}
                onReset={handleResetFilters}
            />
            
            {/* Proyectos principales */}
            {displayProjects.length > 0 && <Proyect proyecto={displayProjects[0]} />}
            {displayProjects.length > 1 && <ProyectL proyecto={displayProjects[1]} />}
            
            {/* Galería de proyectos restantes */}
            {displayProjects.length > 2 && <GalleryProyects projects={displayProjects.slice(2)} />}
            
            {/* Mensaje si no hay proyectos */}
            {displayProjects.length === 0 && (
                <div className="container mx-auto px-4 py-24 text-center">
                    <p className="text-xl text-gray-500 mb-4">No se encontraron proyectos que coincidan con los filtros seleccionados.</p>
                    <Button 
                        onClick={handleResetFilters}
                        variant="outline"
                    >
                        Limpiar filtros
                    </Button>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default Portfolio;
