"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Share2,
  Maximize,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Definición de tipos para el objeto proyecto
interface Atributo {
  nombre: string
  valor: string
}

interface Enlace {
  titulo: string
  url: string
}

interface Proyecto {
  id: string
  titulo: string
  cliente: string
  categoria: string
  descripcion: string
  imagenes: string[]
  ubicacion: {
    ciudad: string
    pais: string
  }
  area: number
  anoConstruccion: number
  estado: "Completado" | "En progreso" | "Planificación"
  atributos: Atributo[]
  enlaces: Enlace[]
  proyectoAnterior?: {
    id: string
    titulo: string
  }
  proyectoSiguiente?: {
    id: string
    titulo: string
  }
}

interface ProyectoDetalleProps {
  proyecto: Proyecto
}

export default function ProyectoDetalle({ proyecto }: ProyectoDetalleProps) {
  const [imagenActual, setImagenActual] = useState(0)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  // Función para navegar entre imágenes
  const navegarImagen = (direccion: "anterior" | "siguiente") => {
    if (direccion === "anterior") {
      setImagenActual((prev) => (prev === 0 ? proyecto.imagenes.length - 1 : prev - 1))
    } else {
      setImagenActual((prev) => (prev === proyecto.imagenes.length - 1 ? 0 : prev + 1))
    }
  }

  // URL actual para compartir
  const urlActual = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="animate-in fade-in duration-700 w-full max-w-7xl mx-auto">
      {/* Carrusel de imágenes */}
      <section className="relative w-full h-[50vh] md:h-[70vh] mb-8 overflow-hidden rounded-xl">
        <div className="relative w-full h-full">
          {proyecto.imagenes.map((imagen, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === imagenActual ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <Image
                src={imagen || "/placeholder.svg"}
                alt={`${proyecto.titulo} - Imagen ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Controles de navegación */}
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

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {proyecto.imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => setImagenActual(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === imagenActual ? "bg-white w-4" : "bg-white/50",
                )}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>

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
                <Image
                  src={proyecto.imagenes[imagenActual] || "/placeholder.svg"}
                  alt={`${proyecto.titulo} - Imagen ${imagenActual + 1}`}
                  fill
                  className="object-contain"
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
        </div>
      </section>

      {/* Información principal */}
      <section className="mb-12 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <Badge className="mb-2 bg-neutral-800 hover:bg-neutral-700 text-white">{proyecto.categoria}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{proyecto.titulo}</h1>
            <p className="text-lg text-neutral-500 mt-2">Cliente: {proyecto.cliente}</p>
          </div>

          <div className="flex gap-2">
            <Link href="/proyectos">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a proyectos
              </Button>
            </Link>

            <TooltipProvider>
              <Tooltip open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="gap-2">
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
                      href={`https://twitter.com/intent/tweet?url=${urlActual}&text=${encodeURIComponent(proyecto.titulo)}`}
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
          <p className="text-lg leading-relaxed">{proyecto.descripcion}</p>
        </div>
      </section>

      {/* Detalles técnicos */}
      <section className="mb-12 px-4 md:px-0">
        <h2 className="text-2xl font-semibold mb-6">Detalles técnicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Ubicación</h3>
              <p className="text-lg font-medium">
                {proyecto.ubicacion.ciudad}, {proyecto.ubicacion.pais}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Área</h3>
              <p className="text-lg font-medium">{proyecto.area} m²</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Año</h3>
              <p className="text-lg font-medium">{proyecto.anoConstruccion}</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-50 border-neutral-200 transition-all hover:shadow-md">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Estado</h3>
              <p className="text-lg font-medium">{proyecto.estado}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Atributos personalizados */}
      {proyecto.atributos.length > 0 && (
        <section className="mb-12 px-4 md:px-0">
          <h2 className="text-2xl font-semibold mb-6">Especificaciones técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {proyecto.atributos.map((atributo, index) => (
              <div key={index} className="flex justify-between py-3 border-b border-neutral-200">
                <span className="font-medium">{atributo.nombre}</span>
                <span className="text-neutral-600">{atributo.valor}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enlaces externos */}
      {proyecto.enlaces.length > 0 && (
        <section className="mb-12 px-4 md:px-0">
          <h2 className="text-2xl font-semibold mb-6">Recursos adicionales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {proyecto.enlaces.map((enlace, index) => (
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
      <section className="mt-16 mb-12 px-4 md:px-0 border-t border-neutral-200 pt-8">
        <div className="flex justify-between">
          {proyecto.proyectoAnterior ? (
            <Link href={`/proyectos/${proyecto.proyectoAnterior.id}`} className="flex items-center gap-2 group">
              <ChevronLeft className="h-5 w-5 text-neutral-500 group-hover:text-black transition-colors" />
              <div>
                <p className="text-sm text-neutral-500">Proyecto anterior</p>
                <p className="font-medium group-hover:text-neutral-800 transition-colors">
                  {proyecto.proyectoAnterior.titulo}
                </p>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {proyecto.proyectoSiguiente ? (
            <Link
              href={`/proyectos/${proyecto.proyectoSiguiente.id}`}
              className="flex items-center gap-2 text-right group"
            >
              <div>
                <p className="text-sm text-neutral-500">Proyecto siguiente</p>
                <p className="font-medium group-hover:text-neutral-800 transition-colors">
                  {proyecto.proyectoSiguiente.titulo}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:text-black transition-colors" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </section>
    </div>
  )
}




import ProyectoDetalle from "@/components/proyecto-detalle"

// Datos de ejemplo para mostrar el componente
const proyectoEjemplo = {
  id: "casa-moderna-2023",
  titulo: "Casa Moderna Minimalista",
  cliente: "Familia Rodríguez",
  categoria: "Residencial",
  descripcion:
    "Este proyecto residencial contemporáneo se sitúa en una parcela con vistas privilegiadas al mar. El diseño busca maximizar la conexión con el entorno natural mientras proporciona espacios funcionales y elegantes. La vivienda se organiza en dos volúmenes principales que se articulan creando patios interiores que aportan luz natural a todas las estancias. Los materiales utilizados —hormigón visto, madera y vidrio— establecen un diálogo armonioso con el paisaje circundante. La sostenibilidad ha sido un factor clave en el diseño, incorporando sistemas de energía solar, recolección de agua de lluvia y una cuidadosa orientación para optimizar la eficiencia energética. Los interiores fluyen naturalmente hacia espacios exteriores cubiertos, difuminando los límites entre dentro y fuera, y creando una experiencia de vida que cambia con las estaciones.",
  imagenes: [
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
    "/placeholder.svg?height=1080&width=1920",
  ],
  ubicacion: {
    ciudad: "Valencia",
    pais: "España",
  },
  area: 320,
  anoConstruccion: 2023,
  estado: "Completado",
  atributos: [
    { nombre: "Estructura", valor: "Hormigón armado" },
    { nombre: "Fachada", valor: "Hormigón visto y madera de cedro" },
    { nombre: "Pisos", valor: "Microcemento y madera natural" },
    { nombre: "Ventanas", valor: "Aluminio con rotura de puente térmico" },
    { nombre: "Eficiencia energética", valor: "Certificación A" },
    { nombre: "Sistema de climatización", valor: "Aerotermia" },
    { nombre: "Domótica", valor: "Sistema KNX integrado" },
    { nombre: "Paisajismo", valor: "Jardín mediterráneo de bajo consumo" },
  ],
  enlaces: [
    { titulo: "Planos técnicos", url: "#" },
    { titulo: "Estudio de sostenibilidad", url: "#" },
    { titulo: "Publicación en Architectural Digest", url: "#" },
  ],
  proyectoAnterior: {
    id: "edificio-oficinas-tech",
    titulo: "Edificio de Oficinas Tech Hub",
  },
  proyectoSiguiente: {
    id: "rehabilitacion-loft-industrial",
    titulo: "Rehabilitación Loft Industrial",
  },
}

export default function Home() {
  return (
    <main className="py-12">
      <ProyectoDetalle proyecto={proyectoEjemplo} />
    </main>
  )
}

