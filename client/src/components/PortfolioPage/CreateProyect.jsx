import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useProjects } from "../../contexts/ProjectContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Loader2, Upload, X, Plus } from "lucide-react";

const CreateProyect = () => {
    const navigate = useNavigate();
    const { addProject, refreshProjects } = useProjects();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        status: "active",
        order_position: 0,
        client: "",
        location: "",
        area: "",
        images: []
    });
    const [attributes, setAttributes] = useState([]);
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState("");
    const [previewImages, setPreviewImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));

        // Crear previsualizaciones
        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        setPreviewImages(newPreviews);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(file => 
                file.type.startsWith("image/")
            );
            
            setFormData(prev => ({
                ...prev,
                images: files
            }));
            
            // Crear previsualizaciones
            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                file
            }));
            setPreviewImages(newPreviews);
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        
        const newPreviews = [...previewImages];
        newPreviews.splice(index, 1);
        
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
        setPreviewImages(newPreviews);
    };

    const handleAddAttribute = () => {
        const key = document.getElementById("attrKey").value;
        const value = document.getElementById("attrValue").value;
        
        if (key && value) {
            setAttributes([...attributes, { key, value }]);
            document.getElementById("attrKey").value = "";
            document.getElementById("attrValue").value = "";
        }
    };

    const removeAttribute = (index) => {
        const newAttrs = [...attributes];
        newAttrs.splice(index, 1);
        setAttributes(newAttrs);
    };

    const handleAddLink = () => {
        if (newLink && !links.includes(newLink)) {
            setLinks([...links, newLink]);
            setNewLink("");
        }
    };

    const removeLink = (index) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log("Creando proyecto con datos:", formData);
            
            // Convertir attributes y links a JSON string para almacenarlos en 'metadata'
            const metadata = {
                attributes: attributes,
                links: links
            };

            // Crear un objeto con solo los campos básicos que existen en la tabla projects
            const basicProjectData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                order_position: parseInt(formData.order_position) || 0,
                images: [],
                metadata: JSON.stringify(metadata), // Guardar attributes y links como JSON en un campo metadata
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Opcionalmente añadir campos adicionales si están configurados en la base de datos
            if (formData.client) basicProjectData.client = formData.client;
            if (formData.location) basicProjectData.location = formData.location;
            if (formData.area) basicProjectData.area = formData.area;

            console.log("Datos a enviar a Supabase:", basicProjectData);
            
            // Primero crear el proyecto para obtener su ID
            const project = await addProject(basicProjectData);

            console.log("Proyecto creado:", project);

            // Subir las imágenes
            const imageUrls = [];
            
            for (const file of formData.images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `projects/${project.id}/${fileName}`;

                console.log("Subiendo imagen:", filePath);
                const { error: uploadError } = await supabase.storage
                    .from('project-images')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error("Error al subir imagen:", uploadError);
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('project-images')
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrl);
            }

            console.log("URLs de imágenes:", imageUrls);

            // Actualizar el proyecto con las URLs de las imágenes
            const { error: updateError } = await supabase
                .from('projects')
                .update({ images: imageUrls })
                .eq('id', project.id);

            if (updateError) throw updateError;

            await refreshProjects();
            console.log("Proyecto creado con éxito");
            navigate('/admin/manage/proyectos');
        } catch (err) {
            console.error("Error al crear proyecto:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Crear Nuevo Proyecto</h1>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Columna izquierda */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-medium mb-4">Información Principal</h2>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título*</label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej. Residencia Moderna Costa Azul"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                                    rows="4"
                                    required
                                    placeholder="Describa el proyecto en detalle..."
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        <option value="Residencial">Residencial</option>
                                        <option value="Comercial">Comercial</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Urbano">Urbano</option>
                                        <option value="Concepto">Concepto</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-medium mb-4">Detalles del Proyecto</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                    <Input
                                        type="text"
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        placeholder="Nombre del cliente"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Posición de Orden</label>
                                    <Input
                                        type="number"
                                        name="order_position"
                                        value={formData.order_position || ''}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Ciudad, País"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Área del proyecto</label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            name="area"
                                            value={formData.area || ''}
                                            onChange={handleChange}
                                            placeholder="0"
                                        />
                                        <div className="flex items-center justify-center bg-slate-100 px-3 border border-l-0 rounded-r-md">
                                            m²
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-medium mb-4">Información Adicional</h2>
                            
                            <div className="mb-6">
                                <h3 className="text-sm font-medium mb-2">Atributos personalizados</h3>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        id="attrKey"
                                        placeholder="Nombre"
                                        className="flex-1"
                                    />
                                    <Input
                                        id="attrValue"
                                        placeholder="Valor"
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={handleAddAttribute}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {attributes.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {attributes.map((attr, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                                                <div className="flex-1 font-medium text-sm">{attr.key}:</div>
                                                <div className="flex-1 text-sm">{attr.value}</div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeAttribute(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium mb-2">Enlaces externos</h3>
                                <div className="flex mb-2">
                                    <Input
                                        placeholder="https://ejemplo.com"
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        className="rounded-r-none"
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={handleAddLink} 
                                        className="rounded-l-none"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                {links.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        {links.map((link, index) => (
                                            <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline truncate"
                                                >
                                                    {link}
                                                </a>
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => removeLink(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Columna derecha */}
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-xl font-medium mb-4">Imágenes del Proyecto</h2>
                            
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 ${
                                    false ? "border-blue-500 bg-blue-50" : "border-slate-300"
                                }`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="rounded-full bg-slate-100 p-3">
                                        <Upload className="h-6 w-6 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">Arrastra y suelta imágenes o</p>
                                        <p className="text-xs text-slate-500">Formatos soportados: JPG, PNG, GIF</p>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        Seleccionar archivos
                                    </Button>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            
                            {previewImages.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Imágenes cargadas ({previewImages.length})</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {previewImages.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square rounded-md overflow-hidden border bg-slate-50">
                                                    <img
                                                        src={image.url}
                                                        alt={`Imagen ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="h-8 w-8"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-1 left-1 bg-white/80 text-xs px-1.5 py-0.5 rounded">
                                                    {index === 0 ? "Principal" : `#${index + 1}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/manage/proyectos')}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando proyecto...
                            </>
                        ) : (
                            "Crear Proyecto"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateProyect; 