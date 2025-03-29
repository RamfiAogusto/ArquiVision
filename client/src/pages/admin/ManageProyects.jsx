import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/admin/Nav";
import { useState, useEffect } from "react";

function ManageProyects() {
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
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
                    setProjects(data);
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
            });
    }, []);

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:8080/projects/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            setProjects(projects.filter((project) => project.id !== id));
        } else {
            console.error("Error deleting project:", response.statusText);
        }
    };

    const filteredProjects = Array.isArray(projects) 
        ? projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Nav />
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Proyectos</h1>
                    <Link
                        to="/admin/manage/proyectos/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Nuevo Proyecto
                    </Link>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar proyecto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ubicación
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.map((project) => (
                                <tr key={project.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {project.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {project.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {project.client}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/admin/manage/proyectos/edit/${project.id}`}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded-md"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded-md"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageProyects;
