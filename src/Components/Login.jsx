import {useEffect, useState} from 'react';
import {useAuth} from "../Contexts/AuthContext";

const Login = () => {
    const [Username, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [error, setError] = useState(""); // Estado para manejar el mensaje de error
    const { login } = useAuth(); // Obtenemos la función login del contexto de autenticación

    useEffect(() => {
        // Cambiar el estado del checkbox para abrir el modal cuando se monte el componente
        document.getElementById('login').checked = true;
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevenir el envío predeterminado del formulario

        try {
            const response = await fetch("https://back.reportmanagemet.software/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify({Username, Password})
            });

            if (response.ok) {
                const data = await response.json();
                // eslint-disable-next-line no-unused-vars
                const { token, refresh_token } = data; // Obtenemos tanto el token de acceso como el token de actualización
                login(token, refresh_token);  // Llamamos a la función login con el token obtenido
                console.log(token);
                console.log(refresh_token);

            } else {
                setError("Credenciales incorrectas. Por favor, inténtalo de nuevo."); // Establece el mensaje de error si las credenciales son incorrectas
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde."); // Establece el mensaje de error si ocurre un error en la solicitud
        }
    };

    return (
        <div>
            <input type="checkbox" id="login" className="modal-toggle"/>

            <div className="modal" role="dialog">
                <div className="modal-box" style={{background: 'linear-gradient(to bottom, #75757E 0%, #30292F 100%)'}}>
                    <h1 className="text-5xl font-bold text-white">Login</h1>
                    <form className="card-body" onSubmit={handleLogin}>
                        <div className="form-control">
                            <label className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                     className="w-4 h-4 opacity-70">
                                    <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
                                </svg>
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={Username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="input input-bordered bg-white"
                                required/>
                        </div>
                        <div className="form-control">
                            <label className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                     className="w-4 h-4 opacity-70">
                                    <path fillRule="evenodd"
                                          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                          clipRule="evenodd"/>
                                </svg>
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                className="input input-bordered bg-white"
                                required/>
                            <label className="label">
                            </label>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-neutral">Login</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;
