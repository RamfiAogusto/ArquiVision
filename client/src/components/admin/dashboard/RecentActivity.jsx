import React from "react";
import { useProjects } from "../../../contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Edit, PlusCircle, Trash } from "lucide-react";

// Función para formatear fechas como "hace X tiempo"
const formatRelativeDate = (dateString) => {
  if (!dateString) return "Fecha desconocida";
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

export default function RecentActivity() {
  const { projects, loading } = useProjects();

  // Ordenar proyectos por fecha de actualización (más recientes primero)
  const sortedProjects = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];
    
    return [...projects]
      .sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
        const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);
        return dateB - dateA;
      })
      .slice(0, 5); // Mostrar solo los 5 más recientes
  }, [projects]);

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-medium">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          // Estado de carga
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedProjects.length === 0 ? (
          // Sin actividad
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No hay actividad reciente</h3>
            <p className="text-sm text-muted-foreground">
              Las actividades aparecerán aquí cuando se realicen cambios.
            </p>
          </div>
        ) : (
          // Lista de actividades
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div key={project.id} className="flex items-start space-x-4">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  {project.created_at === project.updated_at ? (
                    <PlusCircle className="h-5 w-5 text-blue-700" />
                  ) : (
                    <Edit className="h-5 w-5 text-blue-700" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {project.created_at === project.updated_at
                      ? "Proyecto creado"
                      : "Proyecto actualizado"}
                  </p>
                  <p className="text-sm text-muted-foreground">{project.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(project.updated_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
