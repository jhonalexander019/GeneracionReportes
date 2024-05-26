import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate  } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileArrowDown, faSliders } from '@fortawesome/free-solid-svg-icons';

const calculateCircleTop = (menuItemElement) => {
    const menuItemRect = menuItemElement.getBoundingClientRect();
    const menuRect = document.querySelector('.nav-bar').getBoundingClientRect();
    return ((menuItemRect.top - menuRect.top) + menuItemRect.height) - 90;
};

const NavBar = () => {
    const [circleTop, setCircleTop] = useState(-100); // Estado para la posición superior inicial del círculo (fuera de la vista)
    const [selectedOption, setSelectedOption] = useState(""); // Estado para almacenar la opción seleccionada
    const location = useLocation();
    const navigate  = useNavigate ();


    // Define los elementos del menú
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const menuItems = [
        { to: "/Home", icon: faHome, label: "Home" },
        { to: "/reportes", icon: faFileArrowDown, label: "Reportes" },
        { to: "/gestion-reportes", icon: faSliders, label: "Gestión de Reportes" }
    ];


    useEffect(() => {
        const currentPath = location.pathname;
        const menuItem = menuItems.find(item => item.to === currentPath);

        if (menuItem) {
            setSelectedOption(menuItem.label);
            const menuItemIndex = menuItems.indexOf(menuItem);
            const menuItemElement = document.querySelector(`.nav-bar ul li:nth-child(${menuItemIndex + 1})`);
            const newCircleTop = calculateCircleTop(menuItemElement);
            setCircleTop(newCircleTop);
        }
    }, [location.pathname, menuItems]);

    useEffect(() => {
        const handleWindowResize = () => {
            const menuItem = document.querySelector(`.nav-bar ul li.selected`);
            if (menuItem) {
                const newCircleTop = calculateCircleTop(menuItem);
                setCircleTop(newCircleTop);
            }
        };

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        // Redireccionar si la ruta es "/"
        if (location.pathname === "/") {
            navigate("/Home");
        }
    }, [location.pathname, navigate]);

    return (
        <nav className="relative flex items-center nav-bar h-screen" style={{clipPath: "url(#navClipPath)"}}>
            <div className="circle hidden md:flex" style={{top: `${circleTop}px`, right: '-39.5px'}}>
                <svg  xmlns="http://www.w3.org/2000/svg" width="65" height="99" viewBox="0 0 48 73"
                     fill="none">
                    <path
                        d="M47.4431 38C47.4431 54.5685 35.5685 72.5 19 72.5C12.5569 58.5 0 53.0685 0 36.5C0 19.9315 12.5 12 19 0C35.5685 0 47.4431 21.4315 47.4431 38Z"
                        fill="rgb(243 244 246)"/>
                </svg>
            </div>
            {/* Circulo animado */}
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index} className={selectedOption === item.label ? "selected" : ""}>
                        <Link to={item.to} >
                            <FontAwesomeIcon icon={item.icon}/>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="content-below">
                {/* Contenido debajo del nav */}
            </div>
        </nav>
    );
};

export default NavBar;
