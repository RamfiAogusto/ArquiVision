import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/admin/Nav";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function ManageProyects() {
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        setLoading(true);
        fetch("http://localhost:8080/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Datos recibidos:", data);
                if (Array.isArray(data)) {
                    // Ordenar los proyectos por order_position explícitamente
                    const sortedProjects = sortProjectsByOrderPosition(data);
                    setProjects(sortedProjects);
                } else {
                    console.error("Error: los datos recibidos no son un array", data);
                    setProjects([]);
                    if (data.error) {
                        alert(`Error al cargar proyectos: ${data.error}`);
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                setProjects([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Función para ordenar proyectos por order_position
    const sortProjectsByOrderPosition = (projectsArray) => {
        // Asignar posiciones temporales a elementos sin order_position
        let tempArray = projectsArray.map(project => {
            return {
                ...project,
                // Si order_position es null, asignar un valor alto (para que vayan al final)
                _orderForSort: project.order_position !== null ? project.order_position : 9999
            };
        });

        // Ordenar por la posición (temporal o real)
        tempArray.sort((a, b) => a._orderForSort - b._orderForSort);
        
        // Actualizar order_position con el índice actual si era null
        return tempArray.map((project, index) => {
            // Si no tenía order_position, asignar el índice actual
            if (project.order_position === null) {
                return {
                    ...project,
                    order_position: index,
                    _orderForSort: undefined
                };
            }
            
            // Si ya tenía order_position, simplemente eliminar el campo temporal
            delete project._orderForSort;
            return project;
        });
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:8080/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            setProjects(projects.filter((project) => project.id !== id));
            
            // Actualizar también el caché después de eliminar
            const updatedProjects = projects.filter((project) => project.id !== id);
            sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
        } else {
            console.error("Error deleting project:", response.statusText);
        }
    };

    // Función para actualizar el orden de los proyectos
    const updateProjectOrder = async (reorderedProjects) => {
        try {
            // Actualizar los order_position en el array local
            const updatedProjects = reorderedProjects.map((project, index) => ({
                ...project,
                order_position: index
            }));
            
            // Actualizar el estado
            setProjects(updatedProjects);
            
            // Actualizar caché
            sessionStorage.setItem('cachedProjects', JSON.stringify(updatedProjects));
            
            // Preparar datos para enviar al servidor (solo id y order_position)
            const orderData = updatedProjects.map((p, index) => ({
                id: p.id,
                order_position: index
            }));

            console.log("Enviando datos de orden:", orderData);
            
            // Enviar los cambios al servidor
            const response = await fetch("http://localhost:8080/projects/reorder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || response.statusText);
            }
            
            // Opcional: mostrar mensaje de éxito
            console.log("Orden actualizado exitosamente en el servidor");
            
        } catch (error) {
            console.error("Error al actualizar el orden:", error);
            // Recargar proyectos en caso de error para restablecer el estado original
            fetchProjects();
        }
    };

    // Función que se ejecuta cuando termina un arrastre
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        
        const items = Array.from(projects);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        // Actualizar el orden en el servidor
        updateProjectOrder(items);
    };

    const filteredProjects = Array.isArray(projects) 
        ? projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="container mx-auto px-4 py-8">
            <Nav />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestionar Proyectos</h1>
                <Link
                    to="/admin/manage/proyectos/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Agregar Proyecto
                </Link>
            </div>
            
            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar proyectos..."
                className="w-full p-2 border rounded mb-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {loading ? (
                <div className="text-center py-10">Cargando proyectos...</div>
            ) : (
                /* Lista de proyectos con drag and drop */
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="projects">
                        {(provided) => (
                            <div 
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="bg-white shadow-md rounded-lg overflow-hidden"
                            >
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Orden
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Categoría
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProjects.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                    No hay proyectos para mostrar
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProjects.map((project, index) => (
                                                <Draggable 
                                                    key={project.id} 
                                                    draggableId={project.id} 
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <tr
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    {project.images && project.images.length > 0 ? (
                                                                        <img 
                                                                            className="h-10 w-10 rounded-full mr-3 object-cover" 
                                                                            src={project.images[0]} 
                                                                            alt={project.name}
                                                                            onError={(e) => {
                                                                                e.target.src = "https://dummyimage.com/40x40";
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                                                                    )}
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {project.name}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {project.intention || "No especificada"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <Link
                                                                    to={`/admin/manage/proyectos/edit/${project.id}`}
                                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                                >
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(project.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
}

export default ManageProyects;
