import React from "react";
import Iconsvg from "/default.png";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <header className="text-gray-600 body-font max-h-24">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <img className="w-40" src={Iconsvg} alt="Logo" />
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link to="/servicios" className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Servicios</Link>
                    <Link to="/portafolio" className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Portafolio</Link>
                    <Link to="/nosotros" className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Nosotros</Link>
                    <Link to="/contactos" className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Contactos</Link>
                </nav>
                <Link to="/admin/login" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    Admin
                    <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4 ml-1"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </Link>
            </div>
        </header>
    );
}

export default Nav;
