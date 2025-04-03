import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../ui/card";
import { FolderKanban, Users } from "lucide-react";

export default function Shortcut({ name, toUrl }) {
  const navigate = useNavigate();
  const isProjects = name.toLowerCase().includes("proyecto");

  // Determinar icono según el tipo de acceso directo
  const Icon = isProjects ? FolderKanban : Users;
  
  return (
    <Card 
      className="flex-1 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(toUrl)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Icon size={24} className="text-blue-700" />
        </div>
        <h3 className="text-lg font-medium mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {isProjects 
            ? "Gestionar proyectos del portafolio" 
            : "Administrar miembros del equipo"
          }
        </p>
      </CardContent>
    </Card>
  );
}
