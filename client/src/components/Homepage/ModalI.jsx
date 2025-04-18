import React from 'react';
import { X } from 'lucide-react';

/**
 * Componente de Modal para imágenes
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.imageUrl - URL de la imagen a mostrar
 * @param {string} props.alt - Texto alternativo para la imagen
 */
const ModalI = ({ isOpen, onClose, imageUrl, alt }) => {
    if (!isOpen) return null;
    
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div 
                className="relative max-w-5xl max-h-[90vh]" 
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={imageUrl} 
                    alt={alt || 'Imagen ampliada'} 
                    className="max-w-full max-h-[85vh] object-contain"
                />
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                    aria-label="Cerrar"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default ModalI; 