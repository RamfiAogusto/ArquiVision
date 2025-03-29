import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../components/Homepage/Footer";

const ProyectoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Intentar cargar el proyecto desde sessionStorage primero
        const cachedProjects = sessionStorage.getItem('cachedProjects');
        
        if (cachedProjects) {
            const projects = JSON.parse(cachedProjects);
            const foundProject = projects.find(p => p.id === id);
            
            if (foundProject) {
                console.log("Proyecto encontrado en caché:", foundProject);
                setProyecto(foundProject);
                setLoading(false);
                return;
            }
        }

        // Si no está en caché, hacer la petición
        const fetchProyecto = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/projects/${id}`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                setProyecto(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar el proyecto:", err);
                setError("No se pudo cargar la información del proyecto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProyecto();
    }, [id]);

    const handleVolver = () => {
        navigate('/Portafolio');
    };

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="container mx-auto px-5 py-24 flex justify-center items-center min-h-screen">
                    <p className="text-xl">Cargando detalles del proyecto...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !proyecto) {
        return (
            <div>
                <Nav />
                <div className="container mx-auto px-5 py-24 flex flex-col justify-center items-center min-h-screen">
                    <p className="text-xl text-red-600 mb-4">{error || "Proyecto no encontrado"}</p>
                    <button 
                        onClick={handleVolver}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors"
                        tabIndex="0"
                    >
                        Volver a Portafolio
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    // Obtener la primera imagen del array images si existe
    const imageUrl = proyecto.images && proyecto.images.length > 0 
        ? proyecto.images[0] 
        : "https://dummyimage.com/600x400";

    return (
        <div>
            <Nav />
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:h-auto h-64 overflow-hidden rounded-lg mb-6 lg:mb-0">
                            <img 
                                alt={proyecto.name} 
                                className="w-full h-full object-cover object-center"
                                src={imageUrl}
                                onError={(e) => {
                                    console.error("Error cargando imagen en detalle:", e);
                                    e.target.src = "https://dummyimage.com/600x400";
                                }}
                            />
                        </div>
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                {proyecto.client || "CLIENTE"}
                            </h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                                {proyecto.name}
                            </h1>
                            <div className="flex mb-4">
                                <span className="flex-grow border-b-2 border-indigo-500 py-2 text-lg px-1">
                                    Descripción
                                </span>
                            </div>
                            <p className="leading-relaxed mb-8">
                                {proyecto.description || "Sin descripción disponible."}
                            </p>
                            
                            <div className="flex flex-col space-y-2">
                                {proyecto.location && (
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Ubicación</span>
                                        <span className="ml-auto text-gray-900">{proyecto.location}</span>
                                    </div>
                                )}
                                
                                {proyecto.size && (
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Tamaño en metros cuadrados</span>
                                        <span className="ml-auto text-gray-900">{proyecto.size}</span>
                                    </div>
                                )}
                                
                                {proyecto.intention && (
                                    <div className="flex border-t border-gray-200 py-2">
                                        <span className="text-gray-500">Intención</span>
                                        <span className="ml-auto text-gray-900">{proyecto.intention}</span>
                                    </div>
                                )}
                                
                                <div className="flex border-t border-b border-gray-200 py-2">
                                    <span className="text-gray-500">ID del Proyecto</span>
                                    <span className="ml-auto text-gray-900">{proyecto.id}</span>
                                </div>
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
            <Footer />
        </div>
    );
};

export default ProyectoDetalle; 