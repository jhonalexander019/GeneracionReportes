import "../Css/App.css";
import {Outlet, useLocation} from "react-router-dom";
import NavBar from "./NavBar";
import {useEffect, useState} from "react";
import menuClose from "../Util/SVG/menuClose.svg";
import menuOpen from "../Util/SVG/menuOpen.svg";

function App() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Redireccionar si la ruta es "/"
        if (isNavOpen) {
            setIsNavOpen(!isNavOpen);
        }
    }, [isNavOpen, location.pathname]);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);

    };

    return (
        <div className="flex m-0 p-0">
            {/* Botón de la barra de navegación */}
            <div className="flex items-center fixed top-0 z-20 pl-3 sm:hidden h-10 bg-[#75757E] w-screen ">
                    <img onClick={toggleNav} src={menuClose} alt="menu cerrado" className={isNavOpen ? 'hidden': ''}/>
                    <img onClick={toggleNav} src={menuOpen} alt="menu abierto" className={!isNavOpen ? 'hidden': ''}/>
            </div>


            {/* Barra de navegación */}
            <div
                className={`w-screen md:max-w-52 fixed top-0 left-0 h-screen text-white z-10 ${isNavOpen ? "block" : "hidden"} sm:block`}>
                <NavBar/>
            </div>

            {/* Contenido */}
            <div className="flex flex-col justify-center flex-grow bg-gray-100 min-h-screen md:ml-52 overflow-auto">
                <Outlet/>
            </div>
        </div>
    );
}


export default App;
