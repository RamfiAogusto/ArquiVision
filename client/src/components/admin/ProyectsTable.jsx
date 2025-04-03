import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, Plus, Edit, Trash, Image, AlertCircle } from "lucide-react";
import { useProjects } from "../../contexts/ProjectContext";

export default function ProyectsTable() {
  const navigate = useNavigate();
  const { projects = [], loading, deleteProject, error, refreshProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [normalizedProjects, setNormalizedProjects] = useState([]);

  // Normalizar los proyectos para manejar diferentes estructuras de datos
  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      // Determinar qué campos usar basado en la estructura de los datos
      const firstProject = projects[0];
      const usesTitle = 'title' in firstProject;
      const usesName = 'name' in firstProject;
      
      console.log("🔍 Análisis de estructura:", { usesTitle, usesName });
      
      // Normalizar proyectos
      const normalized = projects.map(project => ({
        id: project.id,
        title: usesTitle ? project.title : (usesName ? project.name : 'Sin título'),
        description: project.description || '',
        category: project.category || 'Sin categoría',
        status: project.status || 'inactive',
        images: project.images || [],
        order_position: project.order_position || 0,
        created_at: project.created_at,
        updated_at: project.updated_at,
        originalProject: project // Mantener el proyecto original por si acaso
      }));
      
      setNormalizedProjects(normalized);
      console.log("✅ Proyectos normalizados:", normalized.length);
    } else {
      setNormalizedProjects([]);
    }
  }, [projects]);

  console.log("🔄 Renderizando ProyectsTable", { 
    projectsLength: projects?.length, 
    normalizedLength: normalizedProjects.length,
    loadingState: loading,
    errorState: error
  });

  // Filtrar proyectos según la búsqueda
  const filteredProjects = useMemo(() => {
    return normalizedProjects.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [normalizedProjects, searchQuery]);

  // Calcular la paginación
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Manejadores de eventos
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEdit = (id) => {
    navigate(`/admin/manage/proyectos/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      await deleteProject(id);
    }
  };
  
  const handleReload = () => {
    refreshProjects();
  };

  if (error) {
    return (
      <div className="w-full p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error al cargar proyectos</h3>
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={handleReload}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-lg text-gray-500">Cargando proyectos...</div>
      </div>
    );
  }

  if (normalizedProjects.length === 0) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="text-lg text-gray-500">No hay proyectos disponibles</div>
            <Button onClick={() => navigate("/admin/manage/proyectos/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>
          
          {projects.length > 0 && (
            <div className="p-4 border border-amber-300 bg-amber-50 text-amber-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">¡Atención!</h3>
                <p>Hay {projects.length} proyectos en la base de datos, pero no se pudieron normalizar para mostrarlos. Verifica la estructura de los datos.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2" 
                  onClick={handleReload}
                >
                  Recargar Datos
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Columnas de la tabla
  const columns = [
    { key: "title", label: "Título", sortable: true },
    { key: "description", label: "Descripción", sortable: true },
    { key: "category", label: "Categoría", sortable: true },
    { key: "status", label: "Estado", sortable: true },
    { key: "images", label: "Imágenes", sortable: false },
    { key: "actions", label: "Acciones", sortable: false },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar proyectos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleReload}
            title="Actualizar lista de proyectos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </Button>
          <Button onClick={() => navigate("/admin/manage/proyectos/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.description ? (
                    project.description.length > 100
                      ? `${project.description.substring(0, 100)}...`
                      : project.description
                  ) : 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{project.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={project.status === "active" ? "default" : "outline"}
                    >
                      {project.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(project.images) && project.images.length > 0 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <Image className="h-3 w-3" />
                          {project.images.length}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin imágenes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="text-gray-500">No hay proyectos que coincidan con tu búsqueda</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
            {Math.min(currentPage * pageSize, filteredProjects.length)} de{" "}
            {filteredProjects.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 