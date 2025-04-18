import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../components/Homepage/Footer";
import { 
    ChevronLeft, ChevronRight, ArrowLeft, Share2, Maximize, 
    ExternalLink, Facebook, Twitter, Linkedin, X 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { useProjects } from "../contexts/ProjectContext";
import { getProjectById, supabase } from "../lib/supabase";
import ModalI from "../components/Homepage/ModalI";
import Recomendador from "../components/Homepage/Recomendador";
import Loader from "../components/Loader";

const ProyectoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [proyecto, setProyecto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { projects } = useProjects();
    
    // Estados para la interfaz mejorada
    const [imagenActual, setImagenActual] = useState(0);
    const [imagenesCargadas, setImagenesCargadas] = useState([]);
    const [fullscreenOpen, setFullscreenOpen] = useState(false);
    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const [atributos, setAtributos] = useState([]);
    const [enlaces, setEnlaces] = useState([]);
    const [proyectoAnterior, setProyectoAnterior] = useState(null);
    const [proyectoSiguiente, setProyectoSiguiente] = useState(null);
    const [referrerPath, setReferrerPath] = useState('/Portafolio');
    const [imgModal, setImgModal] = useState(false);
    const [imgSelected, setImgSelected] = useState(null);

    useEffect(() => {
        // Limpiar estados al cambiar de proyecto
        setImagenActual(0);
        setImagenesCargadas([]);
        setFullscreenOpen(false);
        setShareMenuOpen(false);
        setAtributos([]);
        setEnlaces([]);
        setProyectoAnterior(null);
        setProyectoSiguiente(null);
        setImgModal(false);
        setImgSelected(null);

        // Intentar obtener la ruta referente de sessionStorage
        const savedReferrer = sessionStorage.getItem('projectReferrer');
        if (savedReferrer) {
            setReferrerPath(savedReferrer);
        }
        
        loadProject();
    }, [id, location]);

    const loadProject = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Primero buscar en el contexto
            const contextProject = projects.find(p => p.id === id);
            if (contextProject) {
                console.log("Proyecto encontrado en el contexto:", contextProject);
                await procesarProyecto(contextProject, projects);
                return;
            }
            
            // Si no está en el contexto, buscar en Supabase
            console.log("Buscando proyecto en Supabase...");
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();
            
            if (error) {
                console.error("Error al cargar el proyecto desde Supabase:", error);
                setError("No se pudo cargar la información del proyecto");
                setLoading(false);
                return;
            }
            
            // Procesar el proyecto obtenido de Supabase
            await procesarProyecto(data, [data]);
        } catch (error) {
            console.error("Error general al cargar el proyecto:", error);
            setError("No se pudo cargar la información del proyecto");
            setLoading(false);
        }
    };

    // Función para procesar los datos del proyecto y preparar los datos adicionales
    const procesarProyecto = async (proyecto, todosProyectos) => {
        setProyecto(proyecto);
        
        // Cargar imágenes
        if (proyecto.images && proyecto.images.length > 0) {
            const imagenesPromesas = proyecto.images.map(async (imagen) => {
                try {
                    if (imagen.startsWith('http')) {
                        return imagen;
                    } else {
                        const { data } = await supabase.storage
                            .from('projects')
                            .getPublicUrl(imagen);
                        return data.publicUrl;
                    }
                } catch (error) {
                    console.error("Error al cargar imagen:", error);
                    return null;
                }
            });

            const imagenesUrls = await Promise.all(imagenesPromesas);
            setImagenesCargadas(imagenesUrls.filter(url => url !== null));
        }
        
        // Procesar metadatos si existen
        if (proyecto.metadata) {
            try {
                let metadata = proyecto.metadata;
                
                // Si metadata es un string, intentar parsearlo como JSON
                if (typeof metadata === 'string') {
                    metadata = JSON.parse(metadata);
                } else if (Array.isArray(metadata) && metadata.length > 0 && typeof metadata[0] === 'string') {
                    // Si es un array y el primer elemento es un string, probablemente sea un JSON string
                    metadata = JSON.parse(metadata[0]);
                }
                
                // Extraer atributos
                if (metadata.attributes && Array.isArray(metadata.attributes)) {
                    setAtributos(metadata.attributes.map(attr => ({
                        nombre: attr.key,
                        valor: attr.value
                    })));
                }
                
                // Extraer enlaces
                if (metadata.links && Array.isArray(metadata.links)) {
                    setEnlaces(metadata.links.map(link => ({
                        titulo: getDisplayUrl(link),
                        url: link
                    })));
                }
            } catch (err) {
                console.error("Error al procesar metadatos:", err);
                console.log("Metadata original:", proyecto.metadata);
            }
        }
        
        // Configurar navegación entre proyectos si hay más de uno
        if (todosProyectos && todosProyectos.length > 1) {
            // Ordenar proyectos por order_position si está disponible
            const proyectosOrdenados = [...todosProyectos].sort((a, b) => {
                const posA = a.order_position !== undefined ? a.order_position : 999;
                const posB = b.order_position !== undefined ? b.order_position : 999;
                return posA - posB;
            });
            
            const indiceActual = proyectosOrdenados.findIndex(p => p.id === proyecto.id);
            
            if (indiceActual > 0) {
                const anterior = proyectosOrdenados[indiceActual - 1];
                setProyectoAnterior({
                    id: anterior.id,
                    titulo: anterior.name || anterior.title || "Proyecto anterior"
                });
            }
            
            if (indiceActual < proyectosOrdenados.length - 1 && indiceActual !== -1) {
                const siguiente = proyectosOrdenados[indiceActual + 1];
                setProyectoSiguiente({
                    id: siguiente.id,
                    titulo: siguiente.name || siguiente.title || "Proyecto siguiente"
                });
            }
        }
        
        setLoading(false);
    };

    // Función para extraer un nombre de visualización a partir de una URL
    const getDisplayUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (e) {
            return url;
        }
    };

    // Función para navegar entre proyectos
    const navegarProyecto = (direccion) => {
        if (!proyectoAnterior && !proyectoSiguiente) return;
        
        const proyectoDestino = direccion === "anterior" ? proyectoAnterior : proyectoSiguiente;
        if (proyectoDestino) {
            navigate(`/Portafolio/${proyectoDestino.id}`);
        }
    };

    // Función para navegar entre imágenes
    const navegarImagen = (direccion) => {
        if (!imagenesCargadas || imagenesCargadas.length <= 1) return;
        
        if (direccion === "anterior") {
            setImagenActual(prev => (prev === 0 ? imagenesCargadas.length - 1 : prev - 1));
        } else {
            setImagenActual(prev => (prev === imagenesCargadas.length - 1 ? 0 : prev + 1));
        }
    };

    const handleVolver = () => {
        navigate(referrerPath);
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Nav />
                <div className="flex-grow flex flex-col items-center justify-center px-4">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        {error}
                    </h1>
                    <Button 
                        onClick={handleVolver}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    // URL actual para compartir
    const urlActual = window.location.href;

    // Obtener la imagen actual o imagen por defecto
    const imageUrl = imagenesCargadas && imagenesCargadas.length > 0 
        ? imagenesCargadas[imagenActual] 
        : "https://dummyimage.com/600x400";

    // Extraer el área desde metadatos si está disponible
    let areaValue = "";
    if (proyecto.size) {
        areaValue = proyecto.size;
    } else if (proyecto.metadata) {
        try {
            const metadata = JSON.parse(proyecto.metadata);
            if (metadata.area) {
                areaValue = metadata.area;
            }
        } catch (e) {}
    }

    return (
        <div>
            <Nav />
            
            <div className="animate-in fade-in duration-700 w-full max-w-7xl mx-auto px-4 py-12">
                {/* Carrusel de imágenes */}
                <section className="relative w-full h-[50vh] md:h-[70vh] mb-8 overflow-hidden rounded-xl">
                    <div className="relative w-full h-full">
                        {imagenesCargadas && imagenesCargadas.length > 0 ? (
                            <>
                                <img
                                    src={imageUrl}
                                    alt={`${proyecto.name || "Proyecto"} - Imagen ${imagenActual + 1}`}
                                    className="w-full h-full object-cover rounded-xl cursor-pointer"
                                    onClick={() => {
                                        setImgSelected(imageUrl);
                                        setImgModal(true);
                                    }}
                                    onError={(e) => {
                                        console.error("Error cargando imagen:", e);
                                        e.target.src = "https://dummyimage.com/600x400";
                                    }}
                                />
                                
                                {/* Modal para ver imágenes ampliadas */}
                                <ModalI 
                                    isOpen={imgModal} 
                                    onClose={() => setImgModal(false)} 
                                    imageUrl={imgSelected}
                                    alt={`${proyecto.name || "Proyecto"} - Vista ampliada`} 
                                />
                                
                                {/* Controles de navegación - Solo si hay más de una imagen */}
                                {imagenesCargadas.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => navegarImagen("anterior")}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                                            aria-label="Imagen anterior"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>

                                        <button
                                            onClick={() => navegarImagen("siguiente")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                                            aria-label="Imagen siguiente"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>

                                        {/* Indicadores de imágenes */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {imagenesCargadas.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setImagenActual(index)}
                                                    className={`w-2 h-2 rounded-full transition-all 
                                                        ${index === imagenActual ? "bg-white w-4" : "bg-white/50"}`}
                                                    aria-label={`Ver imagen ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                
                                {/* Botón de pantalla completa */}
                                <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                                            aria-label="Ver en pantalla completa"
                                        >
                                            <Maximize className="h-5 w-5" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
                                        <div className="relative w-full h-[95vh]">
                                            <img
                                                src={imageUrl}
                                                alt={`${proyecto.name || "Proyecto"} - Imagen ${imagenActual + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                onClick={() => setFullscreenOpen(false)}
                                                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                                                aria-label="Cerrar pantalla completa"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                                <p className="text-gray-500">No hay imágenes disponibles</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Información principal */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <Badge className="mb-2 bg-neutral-800 hover:bg-neutral-700 text-white">
                                {proyecto.intention || "Sin categoría"}
                            </Badge>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                                {proyecto.name || proyecto.title || "Proyecto sin título"}
                            </h1>
                            <p className="text-lg text-neutral-500 mt-2">
                                Cliente: {proyecto.client || "No especificado"}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button 
                                onClick={handleVolver}
                                variant="outline" 
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver a proyectos
                            </Button>
                            
                            <TooltipProvider>
                                <Tooltip open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Share2 className="h-4 w-4" />
                                            Compartir
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="p-2">
                                        <div className="flex gap-2">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${urlActual}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                                aria-label="Compartir en Facebook"
                                            >
                                                <Facebook className="h-5 w-5" />
                                            </a>
                                            <a
                                                href={`https://twitter.com/intent/tweet?url=${urlActual}&text=${encodeURIComponent(proyecto.name || proyecto.title || "Proyecto")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                                aria-label="Compartir en Twitter"
                                            >
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${urlActual}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                                aria-label="Compartir en LinkedIn"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="prose prose-neutral max-w-none">
                        <p className="text-lg leading-relaxed">
                            {proyecto.description || "Sin descripción disponible."}
                        </p>
                    </div>
                </section>

                {/* Detalles técnicos */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Detalles técnicos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Ubicación</h3>
                                <p className="text-lg font-medium">
                                    {proyecto.location || "No especificada"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Área</h3>
                                <p className="text-lg font-medium">
                                    {areaValue ? `${areaValue} m²` : "No especificada"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Estado</h3>
                                <p className="text-lg font-medium">
                                    {proyecto.status === "active" ? "Activo" : "Inactivo"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Categoría</h3>
                                <p className="text-lg font-medium">
                                    {proyecto.intention || "No especificada"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Atributos personalizados */}
                {atributos.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Especificaciones técnicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {atributos.map((atributo, index) => (
                                <div key={index} className="flex justify-between py-3 border-b border-neutral-200">
                                    <span className="font-medium">{atributo.nombre}</span>
                                    <span className="text-neutral-600">{atributo.valor}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Enlaces externos */}
                {enlaces.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Recursos adicionales</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {enlaces.map((enlace, index) => (
                                <a
                                    key={index}
                                    href={enlace.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                                >
                                    <ExternalLink className="h-5 w-5 text-neutral-500" />
                                    <span>{enlace.titulo}</span>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Navegación entre proyectos */}
                {(proyectoAnterior || proyectoSiguiente) && (
                    <section className="mt-16 mb-12 border-t border-neutral-200 pt-8">
                        <div className="flex justify-between">
                            {proyectoAnterior ? (
                                <button
                                    onClick={() => navegarProyecto("anterior")}
                                    className="flex items-center gap-2 group"
                                >
                                    <ChevronLeft className="h-5 w-5 text-neutral-500 group-hover:text-black transition-colors" />
                                    <div>
                                        <p className="text-sm text-neutral-500">Proyecto anterior</p>
                                        <p className="font-medium group-hover:text-neutral-800 transition-colors">
                                            {proyectoAnterior.titulo}
                                        </p>
                                    </div>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {proyectoSiguiente ? (
                                <button
                                    onClick={() => navegarProyecto("siguiente")}
                                    className="flex items-center gap-2 text-right group"
                                >
                                    <div>
                                        <p className="text-sm text-neutral-500">Proyecto siguiente</p>
                                        <p className="font-medium group-hover:text-neutral-800 transition-colors">
                                            {proyectoSiguiente.titulo}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:text-black transition-colors" />
                                </button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </section>
                )}

                {/* Recomendador de proyectos similares */}
                <Recomendador 
                    proyectos={projects.filter(p => p.id !== proyecto.id)} 
                    categoriaActual={proyecto.intention} 
                />
            </div>
            
            <Footer />
        </div>
    );
};

export default ProyectoDetalle; 