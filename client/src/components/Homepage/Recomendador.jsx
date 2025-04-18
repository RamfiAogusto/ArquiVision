import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Componente Recomendador para sugerir proyectos relacionados
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.proyectos - Lista de proyectos para recomendar
 * @param {string} props.categoriaActual - Categoría del proyecto actual
 */
const Recomendador = ({ proyectos = [], categoriaActual }) => {
    const [showAll, setShowAll] = useState(false);
    
    // Si no hay proyectos, no mostrar nada
    if (!proyectos || proyectos.length === 0) return null;
    
    // Filtrar proyectos por categoría (máximo 3)
    const proyectosRecomendados = proyectos
        .filter(p => p.intention === categoriaActual)
        .slice(0, showAll ? proyectos.length : 3);
    
    // Si no hay recomendaciones, no mostrar nada
    if (proyectosRecomendados.length === 0) return null;
    
    return (
        <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Proyectos relacionados</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {proyectosRecomendados.map((proyecto) => (
                    <Card key={proyecto.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48">
                            <img 
                                src={proyecto.images && proyecto.images[0] ? proyecto.images[0] : "https://dummyimage.com/600x400"} 
                                alt={proyecto.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 truncate">{proyecto.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                {proyecto.description}
                            </p>
                            <Link to={`/Portafolio/${proyecto.id}`}>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                >
                                    Ver proyecto
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {proyectos.filter(p => p.intention === categoriaActual).length > 3 && (
                <div className="text-center mt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Ver menos" : "Ver más recomendaciones"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Recomendador; 