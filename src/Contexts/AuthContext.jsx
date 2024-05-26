import { createContext, useState, useContext, useEffect, useRef } from "react";
import { refreshAccessToken } from "../Util/Services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
    const timeoutRef = useRef(null);

    const login = (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        resetInactivityTimeout();
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        clearTimeout(timeoutRef.current);
    };

    const handleTokenRefresh = async () => {
        try {
            const newAccessToken = await refreshAccessToken(refreshToken);
            setAccessToken(newAccessToken);
            console.log(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);
        } catch (error) {
            console.error("Error refreshing access token:", error);
            logout();
        }
    };

    const resetInactivityTimeout = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            logout();
        }, 14 * 60 * 1000); // 14 minutos en milisegundos
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "mousedown", "touchstart"];

        const handleActivity = () => resetInactivityTimeout();

        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        resetInactivityTimeout();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, handleTokenRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
