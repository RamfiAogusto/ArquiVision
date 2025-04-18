import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/**
 * Componente de Modal para filtros en la galería de proyectos
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.filters - Estado actual de los filtros
 * @param {Function} props.onChange - Función para actualizar los filtros
 * @param {Function} props.onApply - Función para aplicar los filtros
 * @param {Function} props.onReset - Función para resetear los filtros
 */
const ModalF = ({ 
    isOpen, 
    onClose, 
    filters = {}, 
    onChange, 
    onApply, 
    onReset 
}) => {
    if (!isOpen) return null;
    
    const handleChange = (field, value) => {
        if (onChange) {
            onChange({ ...filters, [field]: value });
        }
    };
    
    const categories = [
        { value: "todos", label: "Todos" },
        { value: "residencial", label: "Residencial" },
        { value: "comercial", label: "Comercial" },
        { value: "industrial", label: "Industrial" },
        { value: "educativo", label: "Educativo" },
        { value: "publico", label: "Público" },
        { value: "vivienda", label: "Vivienda" }
    ];
    
    const statuses = [
        { value: "todos", label: "Todos" },
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
        { value: "completed", label: "Completado" },
        { value: "in_progress", label: "En progreso" }
    ];
    
    const areaRanges = [
        { value: "todos", label: "Todos" },
        { value: "small", label: "< 100m²" },
        { value: "medium", label: "100m² - 500m²" },
        { value: "large", label: "500m² - 1000m²" },
        { value: "xlarge", label: "> 1000m²" }
    ];
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Filtrar proyectos</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {/* Categoría */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Categoría
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(category => (
                                <Badge 
                                    key={category.value}
                                    variant={filters.category === category.value ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => handleChange('category', category.value)}
                                >
                                    {category.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    
                    {/* Estado */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Estado
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {statuses.map(status => (
                                <Badge 
                                    key={status.value}
                                    variant={filters.status === status.value ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => handleChange('status', status.value)}
                                >
                                    {status.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    
                    {/* Área */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Área
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {areaRanges.map(area => (
                                <Badge 
                                    key={area.value}
                                    variant={filters.area === area.value ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => handleChange('area', area.value)}
                                >
                                    {area.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-2 p-4 border-t">
                    <Button 
                        variant="outline" 
                        onClick={onReset}
                    >
                        Resetear filtros
                    </Button>
                    <Button 
                        onClick={() => {
                            onApply && onApply(filters);
                            onClose();
                        }}
                    >
                        Aplicar filtros
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalF; 