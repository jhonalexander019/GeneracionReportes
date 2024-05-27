import {useContext} from "react";
import { AuthContext } from "../Contexts/AuthContext";
import Login from "../Components/Login";

const PrivateRoutes = ({ children }) => {
    const { accessToken } = useContext(AuthContext); // Obtenemos el token del contexto de autenticación

    return (
        <>
            {accessToken ? (
                // Si el usuario está autenticado, renderiza el contenido protegido
                children
            ) : (
                // Si no está autenticado, redirige a la página de inicio de sesión
                <Login />
            )}
        </>
    );
};

export default PrivateRoutes;
