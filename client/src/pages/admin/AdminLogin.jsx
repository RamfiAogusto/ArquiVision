import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí debería ir la lógica de autenticación
        if (mail === "admin@gmail.com" && password === "password") {
            navigate("/admin/dashboard");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    };

    return (
        <section className="text-gray-600 body-font flex justify-center items-center h-screen">
            <div className="border lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col w-full">
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                    Iniciar sesión
                </h2>
                <form onSubmit={handleLogin}>
                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full">
                        Ingresar
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AdminLogin;
