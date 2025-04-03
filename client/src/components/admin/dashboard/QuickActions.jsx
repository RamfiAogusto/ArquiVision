import React from "react";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { PlusCircle, Users, FolderOpen, FileText } from "lucide-react";

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <Card className="col-span-1">
            <CardHeader className="pb-3">
                <CardTitle className="text-md font-medium">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                        onClick={() => navigate('/admin/manage/proyectos/new')}
                        className="flex justify-start items-center h-auto py-3"
                        variant="outline"
                    >
                        <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Nuevo Proyecto</div>
                            <div className="text-xs text-muted-foreground">Crear un proyecto nuevo</div>
                        </div>
                    </Button>
                    
                    <Button 
                        onClick={() => navigate('/admin/manage/equipo')}
                        className="flex justify-start items-center h-auto py-3"
                        variant="outline"
                    >
                        <Users className="h-5 w-5 mr-2 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Gestionar Equipo</div>
                            <div className="text-xs text-muted-foreground">Administrar miembros</div>
                        </div>
                    </Button>
                    
                    <Button 
                        onClick={() => window.open('/portafolio', '_blank')}
                        className="flex justify-start items-center h-auto py-3"
                        variant="outline"
                    >
                        <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Ver Portafolio</div>
                            <div className="text-xs text-muted-foreground">Visualizar sitio público</div>
                        </div>
                    </Button>
                    
                    <Button 
                        className="flex justify-start items-center h-auto py-3"
                        variant="outline"
                    >
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        <div className="text-left">
                            <div className="font-medium">Generar Informe</div>
                            <div className="text-xs text-muted-foreground">Crear reporte en PDF</div>
                        </div>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
