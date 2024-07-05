import React from "react";
import Iconsvg from "/default.png";

function Nav() {
    return (
        <header className="text-gray-600 body-font max-h-24">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0" href="/">
                    <img className="w-40" src={Iconsvg} />
                </a>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <a className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Servicios</a>
                    <a className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Portafolio</a>
                    <a className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Nosotros</a>
                    <a className="mr-5 cursor-pointer font-bold hover:text-[--primary-color]">Contactos</a>
                </nav>
                <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    Button
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
                </button>
            </div>
        </header>
    );
}

export default Nav;