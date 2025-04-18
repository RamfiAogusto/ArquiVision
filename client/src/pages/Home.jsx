import React, { useEffect } from "react";
import Nav from "../components/Nav";
import Proyects from "../components/Homepage/Proyects";
import Hero from "../components/Homepage/Hero";
import Footer from "../components/Homepage/Footer";
import MVV from "../components/Homepage/MVV";
import ServicesHome from "../components/Homepage/Services";
import Contact from "../components/Homepage/Contact";
import { useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    
    // Guardar la ubicación actual como referencia
    useEffect(() => {
        sessionStorage.setItem('projectReferrer', location.pathname);
    }, [location]);
    
    return (
        <div>
            <Nav />
            <Hero />
            <MVV />
            
            <Proyects />
            <ServicesHome />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;
