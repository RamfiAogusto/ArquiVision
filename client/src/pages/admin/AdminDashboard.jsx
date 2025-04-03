import React from "react";
/* import { Link } from "react-router-dom"; */
import Nav from "../../components/admin/Nav";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import ResentActivity from "../../components/admin/dashboard/ResentActivity";
import Shortcut from "../../components/admin/dashboard/Shortcut";
import { useProjects } from "../../contexts/ProjectContext";

function AdminDashboard() {
    // Usar el contexto de proyectos
    const { projects, loading } = useProjects();
    
    // Número total de proyectos
    const totalProyectos = Array.isArray(projects) ? projects.length : 0;
    
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Nav />
            {/* --------------------------------------------- */}
            <div className="flex gap-3 md:p-8">
                <div className=" border-gray-200 border p-4 rounded-lg w-4/12 min-h-14 bg-gray-200">
                    <div className="flex-grow">
                        <h2 className="text-[--primary-color] title-font text-4xl font-medium mb-2">
                            Dashboard
                        </h2>
                        <p className="text-gray-500">
                            Bienvenido a tu panel de administración. Aquí podrás
                            ver estadísticas clave, actividades recientes y
                            accesos rápidos a las funciones más utilizadas.
                        </p>
                    </div>
                </div>

                <div className=" border-gray-200 border p-4 rounded-lg w-4/12 min-h-14">
                    <div className="flex-grow">
                        <p className="">Resumen estadistico</p>
                        <div className="flex items-end">
                            <h2 className="text-gray-900 title-font text-5xl font-medium mb-2">
                                {loading ? "..." : totalProyectos}
                            </h2>
                            <svg
                                fill=""
                                width="30px"
                                height="30px"
                                viewBox="-2.4 -2.4 28.80 28.80"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#000000"
                                strokeWidth="0.00024000000000000003"
                                className="mb-2 fill-[--primary-color]"
                            >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    stroke="#CCCCCC"
                                    strokeWidth="0.144"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M22.372,5.071l-10-4A1,1,0,0,0,11,2V6H2A1,1,0,0,0,1,7V22a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V6A1,1,0,0,0,22.372,5.071ZM3,8h8V21H3ZM13,21V3.477l8,3.2V8H15v2h6v2H15v2h6v2H15v2h6v3ZM7,12h3v2H7ZM4,12H6v2H4ZM7,9h3v2H7ZM4,9H6v2H4Zm3,6h3v2H7ZM4,15H6v2H4Zm3,3h3v2H7ZM4,18H6v2H4Z"></path>
                                </g>
                            </svg>
                        </div>

                        <p className="text-gray-500 text-sm min-h-14">
                            Proyectos totales
                        </p>
                    </div>
                </div>

                <div className=" border-gray-200 border p-4 rounded-lg w-4/12 min-h-14">
                    <div className="flex-grow">
                        <p className="">Resumen estadistico</p>
                        <div className="flex items-end">
                            <h2 className="text-gray-900 title-font text-5xl font-medium mb-2">
                                23
                            </h2>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-2"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm min-h-14">
                            Miembros del equipo
                        </p>
                    </div>
                </div>
            </div>
            <br />
            <hr />

            <ul className="list-none flex gap-3 md:p-8">
                <Shortcut
                    name="PROYECTOS"
                    toUrl="/admin/manage/proyectos"
                />
                <Shortcut 
                    name="EQUIPO" 
                    toUrl="/admin/manage/equipo" 
                />
            </ul>
            {/* --------------------------------------------- */}

            {/* --------------------------------------------- */}
            <div className="flex flex-col min-h-screen bg-muted/40">
                <main className="flex-1 grid gap-6 p-4 md:p-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        <ResentActivity />
                        {/* -----------acciones rapidas-------------- */}
                        <QuickActions />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
