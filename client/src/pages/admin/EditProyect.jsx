import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getProjectById, updateProject, uploadFile, deleteFile } from "../../lib/supabase";

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
    const [loading, setLoading] = useState(false);

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
                const data = await getProjectById(id);
                if (!data) {
                    throw new Error("Proyecto no encontrado");
                }
                
                setName(data.name);
                setDescription(data.description);
                setLocation(data.location);
                setSize(data.size?.toString() || "");
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
    }, [id, navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        
        // Crear previsualizaciones
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls([...currentImages, ...urls]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Subir nuevas imágenes
            const uploadPromises = images.map(async (image) => {
                const path = `projects/${id}/${Date.now()}-${image.name}`;
                await uploadFile(image, path);
                return path;
            });
            
            const newImagePaths = await Promise.all(uploadPromises);
            
            // Actualizar el proyecto
            const projectData = {
                name,
                description,
                location,
                size: parseFloat(size),
                intention,
                client,
                images: [...currentImages, ...newImagePaths]
            };

            await updateProject(id, projectData);
            navigate("/admin/manage/proyectos");
        } catch (error) {
            console.error("Error detallado:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (index, imageUrl) => {
        try {
            // Si la imagen está en Supabase Storage, eliminarla
            if (imageUrl.includes('storage.googleapis.com')) {
                const path = imageUrl.split('/').slice(-2).join('/');
                await deleteFile(path);
            }
            
            setCurrentImages(currentImages.filter((_, i) => i !== index));
            setPreviewUrls(previewUrls.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            alert("Error al eliminar la imagen");
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
                                    onClick={() => handleRemoveImage(index, url)}
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
                        disabled={loading}
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProject; 