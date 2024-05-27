import "../Css/Reportes.css"
import React, {useContext, useEffect, useRef, useState} from "react";
import {fetchExcelDownload, fetchPaginateReports, fetchReport} from "../Util/Services";
import wrongLine from "../Util/SVG/wrongLine.svg";
import {AuthContext} from "../Contexts/AuthContext";
import Alerts from "../Util/Alerts";
import doneLine from "../Util/SVG/doneLine.svg";

function Reportes() {
    const {accessToken, handleTokenRefresh} = useContext(AuthContext);
    const [reports, setReports] = useState(new Map());
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef(null);  // Ref para el contenedor
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectId, setSelectId] = useState(null);
    const [filterValues, setFilterValues] = useState({}); // Estado para almacenar los valores de los filtros
    const [timerRef, setTimerRef] = useState(null);
    const [alert, setAlert] = useState(null);
    const [idSocket, setIdSocket] = useState(null);


    useEffect(() => {
        // Filtrar resultados basados en el término de búsqueda
        const results = Array.from(reports.entries()).filter(([id, name]) =>
            name.includes(searchTerm)
        );
        setFilteredResults(results);
    }, [searchTerm, reports]);

    useEffect(() => {
        fetchReport(selectId, currentPage, accessToken, handleTokenRefresh, filterValues)
            .then(response => {
                if (response.ok) {
                    return response.json(); // Devuelve los datos si la respuesta es exitosa
                } else {
                    throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                }
            }).then((data) => {
            setHeaders(Object.keys(data.results[0]));
            setData(data.results);

            //setLoading(false); // Establecer loading como false después de un breve tiempo de espera
        })
            .catch((error) => {
                console.error("Error fetching reports:", error);
            })
    }, [currentPage]);

    const handleSelect = (name, id) => {
        setSelectId(id);
        setSearchTerm(name); // Actualizar el estado searchTerm con el nombre seleccionado
        setIsDropdownOpen(false);
        fetchReport(id, currentPage, accessToken, handleTokenRefresh)
            .then(response => {
            if (response.ok) {
                return response.json(); // Devuelve los datos si la respuesta es exitosa
            } else {
                throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
            }
            }).then((data) => {
                setHeaders(Object.keys(data.results[0]));
                setData(data.results);

                //setLoading(false); // Establecer loading como false después de un breve tiempo de espera
            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
            })
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Filter logic for dropdown results
        const results = Array.from(reports.entries()).filter(([id, name]) =>
            name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredResults(results);
        setIsDropdownOpen(true);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsDropdownOpen(false); // Cerrar el dropdown si se hace clic fuera
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Actualiza el estado
    };

    const renderPageButtons = () => {
        const buttons = [];
        for (let i = 1; i <= 9; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`btn min-h-6 p-2 border-0 ${currentPage === i ? 'bg-[#413F54] text-white' : 'bg-transparent text-black'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    // Función para manejar el cambio en los inputs de filtro
    const handleInputChange = (header, value) => {
        setFilterValues(prevState => ({
            ...prevState,
            [header]: value
        }));

        console.log(filterValues)

        // Establecer un nuevo temporizador para ejecutar la búsqueda después de 2 segundos
        if (timerRef) {
            clearTimeout(timerRef);
        }
        const newTimerRef = setTimeout(() => {
            fetchReport(selectId, currentPage, accessToken, handleTokenRefresh, filterValues)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Error de red');
                    }
                })
                .then((data) => {
                    setHeaders(null);
                    setData(null);
                    setHeaders(Object.keys(data.results[0]));
                    setData(data.results);
                })
                .catch((error) => {
                    console.error("Error fetching reports:", error);
                });        }, 2000);
        setTimerRef(newTimerRef);
    };


    // Limpiar el temporizador al desmontar el componente
    useEffect(() => {
        //const accessTokenPrefix = accessToken.substring(0, 7);
        const date = new Date();
        const hour = date.getHours().toString().padStart(2, '0'); // Obtener la hora y asegurarse de que tenga dos dígitos
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Obtener los minutos y asegurarse de que tenga dos dígitos
        const seconds = date.getSeconds().toString().padStart(2, '0'); // Obtener los segundos y asegurarse de que tenga dos dígitos

        const accessTokenPrefix = `${hour}${minutes}${seconds}`; // Combinar la hora, minutos y segundos
        setIdSocket(accessTokenPrefix);
        const ws = new WebSocket(`wss://back.reportmanagemet.software/ws/${accessTokenPrefix}`);
        ws.onopen = function(event) {
            console.log("Connected to WebSocket server");
        };

        ws.onmessage = function(event) {
            const message = event.data;

            // Verificar si el mensaje es una URL
            if (isValidURL(message)) {
                // Cambiar la ubicación de la ventana actual hacia la URL recibida
                window.location.href = message;

                // Remover todas las alertas una vez que se redirige a la nueva URL
                removeAlert();
            }
        };

        // ws.onerror = function(error) {
        //     console.log("WebSocket error:", error);
        // };

        // Agregar el event listener al hacer clic en cualquier parte del documento
        document.addEventListener('mousedown', handleClickOutside);

        fetchPaginateReports(1, 100, accessToken, handleTokenRefresh)
            .then(response => {
                if (response.ok) {
                    return response.json(); // Devuelve los datos si la respuesta es exitosa
                } else {
                    throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                }
            })
            .then((data) => {
                const reportMap = new Map();
                data.results.forEach(report => {
                    reportMap.set(report.ID, report.Name);
                });

                setReports(reportMap);
                //setLoading(false); // Establecer loading como false después de un breve tiempo de espera

            })
            .catch((error) => {
                console.error("Error fetching reports:", error);
            })        // eslint-disable-next-line react-hooks/exhaustive-deps

        return () => {
            // Limpiar la conexión websocket cuando el componente se desmonta
            ws.close();
            // Limpiar el event listener cuando el componente se desmonte
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Función para verificar si una cadena es una URL válida
    function isValidURL(url) {
        // Expresión regular para validar una URL
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlPattern.test(url);
    }

    const handleExcelDownload = () =>{

        fetchExcelDownload(selectId, idSocket, accessToken)
            .then((data)=>{
                if (data.ok)
                    addAlert('¡Generando Reporte!', 'success', doneLine);
                else
                    addAlert('¡Error al Generar el Reporte, Seleccione un Reporte!', 'error', wrongLine);
        }).catch(()=>{
            addAlert('¡Error al Generar el Reporte!', 'error', wrongLine);

        })

    }

    const addAlert = (message, type, img) => {
        setAlert({ message, type, img, isVisible: true });
    };

    const removeAlert = () => {
        setAlert(null);
    };



    return (
        <div className="flex items-center mx-14 h-auto gap-4 md:flex-col py-12 md:py-0">
            <div className="w-10/12">
                <h1 className="text-6xl text-center mb-5">Reporte de Servicios</h1>
                {/* Tu contenido actual */}

                <div className="mb-5 flex flex-row" ref={containerRef}>
                    <div className="w-full relative ">
                        <div className="flex items-center w-full">
                            <label className="input input-bordered flex items-center gap-2 flex-grow">
                                <input
                                    type="text"
                                    className="text-white w-full"
                                    placeholder="Buscar Reporte"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                     className="w-4 h-4 opacity-70">
                                    <path fillRule="evenodd"
                                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                          clipRule="evenodd"/>
                                </svg>
                            </label>
                        </div>
                        {isDropdownOpen && filteredResults.length > 0 && (
                            <ul className="absolute top-full left-0 w-full z-10 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                {filteredResults.map(([id, name]) => (
                                    <li key={id} onClick={() => handleSelect(name, id)}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-200">
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button onClick={handleExcelDownload}
                            className="btn btn-neutral text-white font-bold py-2 px-4 rounded ml-2">
                        Descargar Excel
                    </button>

                </div>
                <div className=" overflow-x-auto mt-5 rounded-lg shadow-xl">
                    {data.length > 0 && (
                        <table className="w-10/12 rounded-lg ">
                            <thead>
                            <tr className="h-10">
                                {headers.map(header => (
                                    <th key={header}>
                                        <input
                                            type="text"
                                            placeholder={`Filtrar ${header}`}
                                            className="pl-5 bg-transparent border-b-2 text-white outline-none focus:border-black"
                                            value={filterValues[header] || ''}
                                            onChange={e => setFilterValues({...filterValues, [header]: e.target.value})}
                                            onKeyUp={e => {
                                                handleInputChange(header, e.target.value);
                                                // Agregar aquí cualquier otra lógica que necesites realizar después de cada pulsación de tecla
                                            }}
                                        />
                                    </th>

                                ))}
                            </tr>
                            <tr className="text-left h-10">
                                {headers.map(header => (
                                    <th key={header} className="pl-5">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="text-left  h-11">
                                    {headers.map((header, columnIndex) => (
                                        <td key={columnIndex} className="pl-5">{row[header]}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="flex justify-center gap-2">
                    {renderPageButtons()}
                </div>

            </div>
            <div className="fixed bottom-4 right-4 z-50 space-y-4">
                {alert && (
                    <div key="alert" role="alert"
                         className={`alert flex items-center text-white shadow-lg rounded transition-transform duration-500 ${alert.isVisible ? 'animate-slideIn' : 'animate-slideOut'} ${alert.type === 'success' ? 'alert-success bg-green-500' : 'alert-error bg-red-500'}`}>
                        <img src={alert.img} alt={alert.message}/>
                        <span>{alert.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reportes;
