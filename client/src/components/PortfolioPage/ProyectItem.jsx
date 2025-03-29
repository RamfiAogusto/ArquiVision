import React from "react";
import { Link } from "react-router-dom";

const ProyectItem = ({ project }) => {
    // Verificar si project existe y tiene propiedades
    if (!project) {
        console.error("ProyectItem recibió un proyecto nulo o indefinido");
        return null;
    }
    
    // Obtener la primera imagen del array images si existe
    const imageUrl = project.images && project.images.length > 0 
        ? project.images[0] 
        : "https://dummyimage.com/600x400";
    
    console.log("Datos del proyecto en ProyectItem:", project);
    console.log("URL de imagen (primera del array):", imageUrl);
    
    return (
        <Link 
            to={`/Portafolio/${project.id}`} 
            className="lg:w-1/3 sm:w-1/2 p-4"
            tabIndex="0"
            aria-label={`Ver proyecto: ${project.name || 'Proyecto'}`}
        >
            {/* Contenedor principal con altura fija */}
            <div className="relative w-full h-64 rounded-lg shadow overflow-hidden">
                {/* Imagen como fondo */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                ></div>
                
                {/* Overlay con información al hacer hover */}
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-90 transition-opacity duration-300">
                    <div className="p-6 h-full flex flex-col justify-center">
                        <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
                            {project.client || 'Cliente'}
                        </h2>
                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                            {project.name || 'Nombre del Proyecto'}
                        </h1>
                        <p className="leading-relaxed">
                            {project.description || 'Sin descripción disponible'}
                        </p>
                        <p className="mt-2 text-indigo-500">
                            Haz clic para ver detalles
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProyectItem;
