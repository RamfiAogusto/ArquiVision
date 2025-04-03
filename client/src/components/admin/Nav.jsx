import React from "react";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center mb-5 gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Link
                className="flex items-center gap-2 text-lg font-semibold sm:text-base"
                to="/admin/dashboard"
                rel="ugc"
            >
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
                    className="w-6 h-6"
                >
                    <line x1="22" x2="2" y1="6" y2="6"></line>
                    <line x1="22" x2="2" y1="18" y2="18"></line>
                    <line x1="6" x2="6" y1="2" y2="22"></line>
                    <line x1="18" x2="18" y1="2" y2="22"></line>
                </svg>
                <span className="sr-only">ArquiVision Admin</span>
            </Link>
            <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
                <Link className="font-bold" to="/admin/dashboard" rel="ugc">
                    Dashboard
                </Link>
                <Link
                    className="text-muted-foreground"
                    to="/admin/manage/proyectos"
                    rel="ugc"
                >
                    Proyectos
                </Link>
                <Link
                    className="text-muted-foreground"
                    to="/admin/manage/equipo"
                    rel="ugc"
                >
                    Equipo
                </Link>
            </nav>
            <div className="ml-auto flex items-center gap-4 md:gap-2 lg:gap-4">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                    <img
                        src="/placeholder.svg"
                        width="32"
                        height="32"
                        className="rounded-full border"
                        alt="Avatar"
                    />
                    <span className="sr-only">Toggle user menu</span>
                </button>
            </div>
        </header>
    );
}

export default Nav;
