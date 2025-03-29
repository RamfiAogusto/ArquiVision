import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [size, setSize] = useState("");
    const [intention, setIntention] = useState("");
    const [client, setClient] = useState("");
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);

    // Valores permitidos para el ENUM intention
    const intentionOptions = [
        "COMERCIAL",
        "RESIDENCIAL",
        "INDUSTRIAL",
        "INSTITUCIONAL",
        "RECREACIONAL"
    ];

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:8080/projects/${id}`);
                const data = await response.json();
                
                setName(data.name);
                setDescription(data.description);
                setLocation(data.location);
                setSize(data.size.toString());
                setIntention(data.intention);
                setClient(data.client);
                setCurrentImages(data.images || []);
                setPreviewUrls(data.images || []);
            } catch (error) {
                console.error("Error al cargar el proyecto:", error);
                navigate("/admin/manage/proyectos");
            }
        };

        fetchProject();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
        // Crear previsualizaciones
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls([...currentImages, ...urls]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Agregar datos del proyecto
        formData.append('name', name);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('size', size);
        formData.append('intention', intention);
        formData.append('client', client);
        formData.append('currentImages', JSON.stringify(currentImages));
        
        // Agregar imágenes nuevas
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await fetch(`http://localhost:8080/projects/${id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error updating project");
            }

            console.log("Proyecto actualizado exitosamente:", data);
            navigate("/admin/manage/proyectos");
        } catch (error) {
            console.error("Error detallado:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="px-24 py-10 bg-gray-100 min-h-screen flex flex-col items-center w-full">
            <h2 className="text-3xl font-bold mb-6">Editar proyecto</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:w-96">
                <div>
                    <label className="block text-sm font-medium">
                        Nombre del proyecto
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Descripción
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Locación
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Tamaño (m²)
                    </label>
                    <input
                        type="number"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Intención
                    </label>
                    <select
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    >
                        <option value="">Selecciona una intención</option>
                        {intentionOptions.map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0) + option.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Cliente</label>
                    <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">
                        Imágenes Actuales
                    </label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {currentImages.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Current ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentImages(currentImages.filter((_, i) => i !== index));
                                        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <label className="block text-sm font-medium mt-4">
                        Agregar Nuevas Imágenes
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-2 border rounded w-full"
                    />
                </div>
                
                <div className="flex justify-between">
                    <Link to="/admin/Manage/Proyectos" className="bg-red-500 px-4 py-2 rounded text-white">
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProject; 