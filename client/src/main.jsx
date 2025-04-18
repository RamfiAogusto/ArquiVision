import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Us from "./pages/Us";
import Contacts from "./pages/Contacts";
import Portfolio from "./pages/Portfolio";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import ProyectDetail from "./components/PortfolioPage/ProyectDetail";
import CreateProyect from "./components/PortfolioPage/CreateProyect";
import EditProyect from "./components/PortfolioPage/EditProyect";
/* --- */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProyects from "./pages/admin/ManageProyects";
import ManageTeam from "./pages/admin/ManageTeam";

// Importar el ProjectProvider
import { ProjectProvider } from './contexts/ProjectContext'

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ProjectProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/portafolio" element={<Portfolio />} />
                    <Route path="/portafolio/:id" element={<ProyectoDetalle />} />
                    <Route path="/nosotros" element={<Us />} />
                    <Route path="/contactos" element={<Contacts />} />
                    {/* --------ADMIN------- */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/manage/proyectos" element={<ManageProyects />} />
                    <Route path="/admin/manage/equipo" element={<ManageTeam />} />
                    <Route path="/admin/manage/proyectos/new" element={<CreateProyect />} />
                    <Route path="/admin/manage/proyectos/edit/:id" element={<EditProyect />} />
                    <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
                </Routes>
            </BrowserRouter>
        </ProjectProvider>
    </React.StrictMode>
);
