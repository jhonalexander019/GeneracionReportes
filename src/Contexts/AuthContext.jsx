import { createContext, useState, useContext, useEffect } from "react";
import { decodeJwt } from "jose";
import { refreshAccessToken } from "../Util/Services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null); // Estado para almacenar el token de acceso
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null); // Estado para almacenar el token de actualización

    // Función para establecer los tokens de acceso y actualización
    const login = (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken); // Guardar el token de acceso en el almacenamiento local
        localStorage.setItem("refreshToken", refreshToken); // Guardar el token de actualización en el almacenamiento local
    };

    // Función para cerrar sesión y eliminar los tokens
    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken"); // Eliminar el token de acceso del almacenamiento local
        localStorage.removeItem("refreshToken"); // Eliminar el token de actualización del almacenamiento local
    };

    // Función para manejar la renovación del token de acceso
    const handleTokenRefresh = async () => {
        try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            setAccessToken(newAccessToken);
        } catch (error) {
            // Manejar errores de renovación de token
            console.error("Error refreshing access token:", error);
            // En caso de error, también cerramos la sesión
            logout();
        }
    };

    useEffect(() => {
        // Comprobar el tiempo de expiración del token de acceso cada 14 minutos
        const interval = setInterval(() => {
            handleTokenRefresh();
        },  1000); // 14 minutos * 60 segundos * 1000 milisegundos

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(interval);
    }, [accessToken]); // Solo ejecuta el efecto cuando cambia el token de acceso

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
