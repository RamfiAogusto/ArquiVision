import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Us from "./pages/Us";
import Contacts from "./pages/Contacts";
import Portfolio from "./pages/Portfolio";
import ProyectDetail from "./components/PortfolioPage/ProyectDetail";
/* --- */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProyects from "./pages/admin/ManageProyects";
import ManageTeam from "./pages/admin/ManageTeam";
import AddProyect from "./pages/admin/AddProyect";
import EditProyect from "./pages/admin/EditProyect";

// Importar el ProjectProvider
import { ProjectProvider } from './contexts/ProjectContext'

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ProjectProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/Servicios" element={<Services />} />
                    <Route path="/Portafolio" element={<Portfolio />} />
                    <Route path="/Portafolio/:id" element={<ProyectDetail />} />
                    <Route path="/Nosotros" element={<Us />} />
                    <Route path="/Contactos" element={<Contacts />} />
                    {/* --------ADMIN------- */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/Dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/Manage/Proyectos" element={<ManageProyects />} />
                    <Route path="/admin/Manage/Equipo"  element={<ManageTeam />} />
                    <Route path="/admin/manage/proyectos/new"  element={<AddProyect />} />
                    <Route path="/admin/manage/proyectos/edit/:id" element={<EditProyect />} />
                    <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
                </Routes>
            </BrowserRouter>
        </ProjectProvider>
    </React.StrictMode>
);
