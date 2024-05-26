import "../Css/GestionReportes.css";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../Contexts/AuthContext";
import SkeletonTable from "../Util/Skeletons/SkeletonTable";
import Table from "../Components/Table";
import {fetchCreateReports, fetchDeleteReports, fetchPaginateReports, fetchUpdateReports} from "../Util/Services";
import ReportsForm from "../Components/ReportsForm";
import doneLine from "../Util/SVG/doneLine.svg";
import wrongLine from "../wrongLine.svg";

function GestionReportes() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null); // Estado para almacenar el registro seleccionado

    const [flag, setFlag] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const {accessToken} = useContext(AuthContext);

    useEffect(() => {
        handlePageChange(currentPage || 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handlePageChange(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(flag)]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0){

            setCurrentPage(pageNumber);
            setSelectedButtonIndex(null);
            setLoading(true);

            fetchPaginateReports(pageNumber, accessToken)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Devuelve los datos si la respuesta es exitosa
                    } else {
                        throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                    }
                })
                .then((data) => {
                    if (data.results.length > 0) {
                        setReports(data.results);
                        setLoading(false); // Establecer loading como false después de un breve tiempo de espera

                    } else handlePageChange(pageNumber - 1);
                })
                .catch((error) => {
                    console.error("Error fetching reports:", error);
                })
        }
    };

    const handleSubmit = async (report) => {

        const reportData = {
            SiteID: 1,
            CreatedBy: 123,
            Module: "Reportes",
            Name: report.Name,
            Query: report.Query,
            Graph: "barras",
            Status: 1,
            Where: report.Where,
            Headers: ""
        };

        if (report.action === "create") {
            fetchCreateReports(reportData, accessToken)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Devuelve los datos si la respuesta es exitosa
                    } else {
                        throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                    }
                })
                .then((data) => {
                    // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                    handlePageChange(currentPage);
                    addAlert('¡Creado Correctamente!', doneLine);

                    setSelectedRow(null);


                })
                .catch((error) => {
                    addAlert('¡Error al crear el reporte!', wrongLine);
                }).finally(() => {
                    setFlag(!flag); // Establecer loading como false después de un breve tiempo de espera
            });
        } else if (report.action === "edit") {
            fetchUpdateReports(report.ID ,reportData, accessToken)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Devuelve los datos si la respuesta es exitosa
                    } else {
                        throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                    }
                })
                .then((data) => {
                    // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                    handlePageChange(currentPage);
                    addAlert('¡Editado Correctamente!', doneLine);

                    setSelectedRow(null);

                })
                .catch((error) => {
                    addAlert('¡Error al editar el reporte!', wrongLine);
                }).finally(() => {
                setFlag(!flag); // Establecer loading como false después de un breve tiempo de espera
            });
        }
    };

    const handleButtonClick = (rowIndex, row) => {
        if (selectedButtonIndex === rowIndex) {
            // Si el botón ya está seleccionado, deseleccionarlo
            setSelectedButtonIndex(null);
            setSelectedRow(null);
        } else {
            // Si no está seleccionado, seleccionarlo
            setSelectedButtonIndex(rowIndex);
            setSelectedRow(row);
        }
    };

    const handleDelete = (rowIndex, row) => {

        fetchDeleteReports(row.ID, accessToken)
            .then(response => {
                if (response.ok) {
                    return response.json(); // Devuelve los datos si la respuesta es exitosa
                } else {
                    throw new Error('Error de red'); // Lanza un error si la respuesta no es exitosa
                }
             })
            .then((data) => {
                // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                handlePageChange(currentPage);
                addAlert('¡Eliminado Correctamente!', doneLine);

            })
            .catch((error) => {
                addAlert('¡Error al eliminar el reporte!', wrongLine);
            }).finally(() => {
            setFlag(!flag); // Establecer loading como false después de un breve tiempo de espera
        });
    };

    const addAlert = (message, img) => {
        const id = Math.random().toString(36).substr(2, 9); // Genera un ID único
        setAlerts(prevAlerts => [...prevAlerts, { id, message, img, isVisible: true }]);
        setTimeout(() => {
            hideAlert(id);
        }, 5000); // Ocultar la alerta después de 5 segundos
    };

    const hideAlert = (id) => {
        setAlerts(prevAlerts => prevAlerts.map(alert => alert.id === id ? { ...alert, isVisible: false } : alert));
        setTimeout(() => {
            removeAlert(id);
        }, 500); // Espera a que la animación de salida termine antes de eliminar
    };

    const removeAlert = (id) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    };

    return (
        <div className="flex flex-col justify-center items-center mx-20 h-screen gap-4 md:flex-row ">
            {loading ? (
                <SkeletonTable/>
            ) : (
                <Table
                    header={['ID', 'Name']}
                    body={reports}
                    handleButtonClick={handleButtonClick}
                    handleDeleteButtonClick={handleDelete}
                    selectedButtonIndex={selectedButtonIndex}
                    page={currentPage}
                    onPageChange={handlePageChange}
                />

            )}

            <ReportsForm handleSubmit={handleSubmit} selectedRow={selectedRow} />

            <div className="fixed bottom-4 right-4 z-50 space-y-4">
                {alerts.map(alert => (
                    <div key={alert.id} role="alert"
                         className={`alert alert-success flex items-center bg-green-500 text-white shadow-lg rounded transition-transform duration-500 ${alert.isVisible ? 'animate-slideIn' : 'animate-slideOut'}`}>
                        <img src={alert.img} alt={alert.message}/>
                        <span>{alert.message}</span>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default GestionReportes;
