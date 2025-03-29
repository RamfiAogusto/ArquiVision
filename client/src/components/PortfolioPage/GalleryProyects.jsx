import React from "react";
import ProyectItem from "./ProyectItem";

const GalleryProyects = ({ projects = [] }) => {
    // Depuración para verificar los datos
    console.log("Proyectos recibidos en GalleryProyects:", projects);
    
    // Si no hay proyectos adicionales para mostrar
    if (projects.length === 0) {
        console.log("No hay proyectos para mostrar en la galería");
        return null;
    }
    
    return (
        <section className="text-gray-600 body-font ">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                        Proyectos Adicionales
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Explora nuestra colección de proyectos arquitectónicos destacados.
                    </p>
                </div>
                <div className="flex flex-wrap -m-4">
                    {projects.map((project) => {
                        console.log("Renderizando proyecto:", project.id, project.name);
                        return (
                            <ProyectItem key={project.id} project={project} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default GalleryProyects;
