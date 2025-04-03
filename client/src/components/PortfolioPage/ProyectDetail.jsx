import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../../lib/supabase";
import { useProjects } from "../../contexts/ProjectContext";

function ProyectDetail() {
    const [proyect, setProyect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects } = useProjects();
    
    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Primero buscar en el contexto
                const contextProject = projects.find(p => p.id === id);
                if (contextProject) {
                    console.log("Proyecto encontrado en el contexto:", contextProject);
                    setProyect(contextProject);
                    setLoading(false);
                    return;
                }
                
                // Si no está en el contexto, buscar en Supabase
                console.log("Buscando proyecto en Supabase...");
                const data = await getProjectById(id);
                setProyect(data);
                console.log("Datos del proyecto desde Supabase:", data);
            } catch (err) {
                console.error("Error al cargar el proyecto:", err);
                setError(`No se pudo cargar el proyecto: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        
        loadProject();
    }, [id, projects]);

    // Función para volver a la página anterior
    const handleVolver = () => {
        navigate(-1);
    };

    // Mostrar mensaje de carga
    if (loading) {
        return (
            <div className="container mx-auto px-5 py-24 flex justify-center items-center">
                <p className="text-xl">Cargando detalles del proyecto...</p>
            </div>
        );
    }

    // Mostrar mensaje de error
    if (error) {
        return (
            <div className="container mx-auto px-5 py-24 flex flex-col justify-center items-center">
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <button 
                    onClick={handleVolver}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
                    tabIndex="0"
                >
                    Volver a Portafolio
                </button>
            </div>
        );
    }

    // Si no hay datos del proyecto
    if (!proyect) {
        return (
            <div className="container mx-auto px-5 py-24 flex flex-col justify-center items-center">
                <p className="text-xl text-red-600 mb-4">No se encontró información del proyecto</p>
                <button 
                    onClick={handleVolver}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
                    tabIndex="0"
                >
                    Volver a Portafolio
                </button>
            </div>
        );
    }

    // Obtener la primera imagen del array images si existe
    const imageUrl = proyect.images && proyect.images.length > 0 
        ? proyect.images[0] 
        : "https://dummyimage.com/400x400";

    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img
                        alt={proyect.name || "Imagen del proyecto"}
                        className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                        src={imageUrl}
                        onError={(e) => {
                            console.error("Error cargando imagen:", e);
                            e.target.src = "https://dummyimage.com/400x400";
                        }}
                    />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mb-6 lg:mb-0 ">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">
                            {proyect.client || "CLIENTE"}
                        </h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                            {proyect.name}
                        </h1>
                        <div className="flex mb-4">
                            <a className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">
                                Descripción
                            </a>
                        </div>
                        <p className="leading-relaxed mb-4">
                            {proyect.description || "Sin descripción disponible"}
                        </p>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">Ubicación</span>
                            <span className="ml-auto text-gray-900">
                                {proyect.location || "No especificada"}
                            </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">
                                Tamaño en metros cuadrados
                            </span>
                            <span className="ml-auto text-gray-900">
                                {proyect.size || "N/A"}
                            </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                            <span className="text-gray-500">Categoría</span>
                            <span className="ml-auto text-gray-900">
                                {proyect.intention || "No clasificada"}
                            </span>
                        </div>
                        
                        <div className="flex mt-6">
                            <button 
                                onClick={handleVolver}
                                className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded transition-colors"
                                tabIndex="0"
                            >
                                Volver a Portafolio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProyectDetail;
