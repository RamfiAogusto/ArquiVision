import React from "react";
/* import { Link } from "react-router-dom"; */
import Nav from "../../components/admin/Nav";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";
import Shortcut from "../../components/admin/dashboard/Shortcut";
import { useProjects } from "../../contexts/ProjectContext";
import { FileSpreadsheet, Folder, Users } from "lucide-react";
import ProjectsChart from "../../components/admin/dashboard/ProjectsChart";
import StatCard from "../../components/admin/dashboard/StatCard";

function AdminDashboard() {
    // Usar el contexto de proyectos
    const { projects, loading } = useProjects();
    
    // Número total de proyectos
    const totalProyectos = Array.isArray(projects) ? projects.length : 0;
    
    // Proyectos activos
    const activeProjects = Array.isArray(projects) 
        ? projects.filter(p => p.status === 'active').length 
        : 0;
    
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <Nav />
            
            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Título del Dashboard */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Bienvenido al panel de administración de ArquiVision
                    </p>
                </div>
                
                {/* Tarjetas de estadísticas */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
                    <StatCard 
                        title="Total de Proyectos" 
                        value={totalProyectos} 
                        loading={loading}
                        icon={<Folder className="h-5 w-5 text-blue-600" />}
                    />
                    <StatCard 
                        title="Proyectos Activos" 
                        value={activeProjects} 
                        loading={loading}
                        icon={<FileSpreadsheet className="h-5 w-5 text-blue-600" />}
                    />
                    <StatCard 
                        title="Miembros del Equipo" 
                        value={23} 
                        loading={false}
                        icon={<Users className="h-5 w-5 text-blue-600" />}
                    />
                </div>
                
                {/* Accesos directos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Shortcut 
                        name="PROYECTOS" 
                        toUrl="/admin/manage/proyectos" 
                    />
                    <Shortcut 
                        name="EQUIPO" 
                        toUrl="/admin/manage/equipo" 
                    />
                </div>
                
                {/* Gráficos y Actividad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProjectsChart projects={projects} />
                    <RecentActivity />
                </div>
                
                {/* Acciones rápidas */}
                <div className="mt-8">
                    <QuickActions />
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
