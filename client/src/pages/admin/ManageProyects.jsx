import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/admin/Nav";
import { useProjects } from "../../contexts/ProjectContext";

function ManageProyects() {
    const { projects, loading } = useProjects();
    const [searchQuery, setSearchQuery] = useState("");
    const [localProjects, setLocalProjects] = useState([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    
    // Sincronizar con el contexto
    useEffect(() => {
        if (Array.isArray(projects)) {
            setLocalProjects([...projects]);
        }
    }, [projects]);
    
    // Función para actualizar el orden
    const updateProjectOrder = async (reorderedProjects) => {
        try {
            // Actualizar UI primero
            setLocalProjects(reorderedProjects);
            
            // Preparar datos para el servidor
            const orderData = reorderedProjects.map((project, index) => ({
                id: project.id,
                order_position: index
            }));
            
            console.log("Enviando datos de orden:", orderData);
            
            // Enviar al servidor
            const response = await fetch("http://localhost:8080/projects/reorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                throw new Error("Error al actualizar el orden");
            }
            
            // Actualizar cache
            const updatedProjects = reorderedProjects.map((project, index) => ({
                ...project,
                order_position: index
            }));
            sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
            
        } catch (error) {
            console.error("Error al actualizar orden:", error);
        }
    };
    
    // Manejar inicio del arrastre
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };
    
    // Manejar el movimiento de elementos
    const handleDragOver = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
        
        // Reordenar elementos
        const itemsCopy = [...localProjects];
        const draggedItem = itemsCopy[draggedItemIndex];
        
        // Quitar el elemento arrastrado
        itemsCopy.splice(draggedItemIndex, 1);
        // Insertar en la nueva posición
        itemsCopy.splice(targetIndex, 0, draggedItem);
        
        // Actualizar el índice del elemento arrastrado
        setDraggedItemIndex(targetIndex);
        // Actualizar la lista
        setLocalProjects(itemsCopy);
    };
    
    // Manejar fin del arrastre
    const handleDragEnd = () => {
        // Actualizar orden en el servidor
        updateProjectOrder(localProjects);
        setDraggedItemIndex(null);
    };
    
    // Filtrar proyectos según búsqueda
    const filteredProjects = Array.isArray(localProjects) 
        ? localProjects.filter(project => 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];
    
    const handleDelete = async (projectId) => {
        if (confirm("¿Estás seguro de eliminar este proyecto?")) {
            try {
                const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
                    method: "DELETE"
                });
                
                if (!response.ok) throw new Error("Error al eliminar");
                
                // Actualizar estado local
                const updatedProjects = localProjects.filter(p => p.id !== projectId);
                setLocalProjects(updatedProjects);
                
                // Actualizar cache
                sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
                
                alert("Proyecto eliminado con éxito");
            } catch (error) {
                console.error("Error:", error);
                alert("Error al eliminar el proyecto");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Nav />
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Gestionar Proyectos</h1>
                
                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        className="p-2 border rounded"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Link 
                        to="/admin/add/proyecto" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Agregar Proyecto
                    </Link>
                </div>
                
                {loading ? (
                    <p className="text-center py-4">Cargando proyectos...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow">
                        {filteredProjects.length === 0 ? (
                            <p className="text-center py-4">No se encontraron proyectos</p>
                        ) : (
                            filteredProjects.map((project, index) => (
                                <div
                                    key={project.id}
                                    draggable={true}
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`p-4 border-b last:border-b-0 hover:bg-gray-50 flex justify-between items-center ${
                                        draggedItemIndex === index ? 'bg-blue-100' : ''
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-3 bg-gray-200 px-2 py-1 rounded text-sm">
                                            {index + 1}
                                        </span>
                                        <span>{project.name}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link 
                                            to={`/admin/edit/proyecto/${project.id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageProyects;
