import React from "react";
import { Link } from "react-router-dom";

const ProyectL = ({ project }) => {
    // Si no hay proyecto, mostrar datos de ejemplo
    const displayProject = project || {
        name: "Proyecto Destacado",
        description: "Información del proyecto no disponible. Visite nuestra página de portafolio para ver proyectos actualizados.",
        location: "Ubicación no disponible",
        size: "N/A",
        intention: "No especificada",
        images: []
    };
    
    // Obtener la primera imagen del array images si existe
    const imageUrl = displayProject.images && displayProject.images.length > 0 
        ? displayProject.images[0] 
        : "https://dummyimage.com/400x400";
    
    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <img
                        alt={displayProject.name || "Imagen del proyecto"}
                        className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                        src={imageUrl}
                        onError={(e) => {
                            console.error("Error cargando imagen:", e);
                            e.target.src = "https://dummyimage.com/400x400";
                        }}
                    />
                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mb-6 lg:mb-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">
                            {displayProject.client || "PROYECTO DESTACADO"}
                        </h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                            {displayProject.name}
                        </h1>
                        <div className="flex mb-4">
                            <a 
                                className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1"
                                tabIndex="0"
                            >
                                Descripción
                            </a>
                        </div>
                        <p className="leading-relaxed mb-4">
                            {displayProject.description}
                        </p>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">Ubicación</span>
                            <span className="ml-auto text-gray-900">
                                {displayProject.location}
                            </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">
                                Tamaño en metros cuadrados
                            </span>
                            <span className="ml-auto text-gray-900">
                                {displayProject.size}
                            </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                            <span className="text-gray-500">Categoría</span>
                            <span className="ml-auto text-gray-900">
                                {displayProject.intention}
                            </span>
                        </div>
                        <div className="flex">
                            {project && project.id && (
                                <Link 
                                    to={`/Portafolio/${displayProject.id}`}
                                    className="flex ml-auto items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                                    tabIndex="0"
                                    aria-label={`Ver más sobre ${displayProject.name}`}
                                >
                                    Ver Más
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            )}
                            
                            {!project && (
                                <Link 
                                    to="/Portafolio"
                                    className="flex ml-auto items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                                    tabIndex="0"
                                >
                                    Ver Portafolio
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProyectL;
