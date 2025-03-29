import React from "react";

const Proyect = ({ project }) => {
    // Si no hay proyecto, no renderizar nada
    if (!project) return null;
    
    // Obtener la primera imagen del array images si existe
    const imageUrl = project.images && project.images.length > 0 
        ? project.images[0] 
        : "https://dummyimage.com/400x400";
    
    return (
        <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">
                            {project.client || "PROYECTO DESTACADO"}
                        </h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                            {project.name || "Proyecto Sin Título"}
                        </h1>
                        <div className="flex mb-4">
                            <a 
                                className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1"
                                tabIndex="0"
                                aria-label="Ver descripción"
                            >
                                Descripción
                            </a>
                        </div>
                        <p className="leading-relaxed mb-4">
                            {project.description || "Sin descripción disponible."}
                        </p>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">Ubicación</span>
                            <span className="ml-auto text-gray-900">
                                {project.location || "No especificada"}
                            </span>
                        </div>
                        <div className="flex border-t border-gray-200 py-2">
                            <span className="text-gray-500">
                                Tamaño en metros cuadrados
                            </span>
                            <span className="ml-auto text-gray-900">
                                {project.size || "N/A"}
                            </span>
                        </div>
                        <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                            <span className="text-gray-500">Intención</span>
                            <span className="ml-auto text-gray-900">
                                {project.intention || "No clasificado"}
                            </span>
                        </div>
                    </div>
                    <img
                        alt={project.name || "Imagen del proyecto"}
                        className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                        src={imageUrl}
                        onError={(e) => {
                            console.error("Error cargando imagen en Proyect:", e);
                            e.target.src = "https://dummyimage.com/400x400";
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Proyect;
