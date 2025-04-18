"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

// Definición de la interfaz Proyecto
interface Proyecto {
  id: string
  name: string
  description: string
  images: string[]
  client?: string
  location?: string
  size?: string
  intention?: string
}

interface PreviewProyectoProps {
  proyecto?: Proyecto
}

const PreviewProyecto: React.FC<PreviewProyectoProps> = ({ proyecto }) => {
  const [imageError, setImageError] = useState(false)
  const defaultImage = "https://dummyimage.com/1200x700"

  // Si no hay proyecto, retornar null y loggear error
  if (!proyecto) {
    console.error("No se proporcionó un proyecto válido para PreviewProyecto")
    return null
  }

  // Determinar la imagen a mostrar
  const imageUrl = imageError || !proyecto.images || proyecto.images.length === 0 ? defaultImage : proyecto.images[0]

  // Manejar error de carga de imagen
  const handleImageError = () => {
    console.warn(`Error al cargar la imagen del proyecto: ${proyecto.id}`)
    setImageError(true)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Sección de información */}
      <div className="flex flex-col justify-between p-6 md:w-1/2">
        <div>
          <p className="text-indigo-500 font-medium mb-2">{proyecto.client || "PROYECTO DESTACADO"}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{proyecto.name}</h3>
          <p className="text-gray-500 mb-6 line-clamp-3">{proyecto.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {proyecto.location && (
              <div>
                <p className="text-sm font-medium text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-500">{proyecto.location}</p>
              </div>
            )}

            {proyecto.size && (
              <div>
                <p className="text-sm font-medium text-gray-900">Tamaño</p>
                <p className="text-sm text-gray-500">{proyecto.size} m²</p>
              </div>
            )}

            {proyecto.intention && (
              <div>
                <p className="text-sm font-medium text-gray-900">Categoría</p>
                <p className="text-sm text-gray-500">{proyecto.intention}</p>
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/Portafolio/${proyecto.id}`}
          className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
          aria-label={`Ver más detalles sobre ${proyecto.name}`}
        >
          Ver Más
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {/* Sección de imagen */}
      <div className="md:w-1/2 h-64 md:h-auto relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Imagen del proyecto ${proyecto.name}`}
          fill
          className="object-cover"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}

export default PreviewProyecto
