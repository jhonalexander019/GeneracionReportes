import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../Contexts/AuthContext";
import SkeletonTable from "../Util/Skeletons/SkeletonTable";
import Table from "../Components/Table";
import {fetchCreateReports, fetchDeleteReports, fetchPaginateReports, fetchUpdateReports} from "../Util/Services";
import ReportsForm from "../Components/ReportsForm";
import doneLine from "../Util/SVG/doneLine.svg";
import wrongLine from "../Util/SVG/wrongLine.svg";
import Alerts from "../Util/Alerts";

function GestionReportes() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRow, setSelectedRow] = useState(null); // Estado para almacenar el registro seleccionado
    const [alerts, setAlerts] = useState([]);
    const [flag, setFlag] = useState(false);
    const {accessToken, handleTokenRefresh} = useContext(AuthContext);

    useEffect(() => {
        handlePageChange(currentPage || 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePageChange = useCallback((pageNumber) => {
        if (pageNumber > 0){
            setCurrentPage(pageNumber);
            setSelectedButtonIndex(null);
            setLoading(true);

            fetchPaginateReports(pageNumber, 10, accessToken, handleTokenRefresh)
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
                    }else handlePageChange(pageNumber - 1);
                })
                .catch((error) => {
                    console.error("Error fetching reports:", error);
                })
        }else addAlert('¡0 reportes encontrados!', 'error', wrongLine);

    }, [(flag)]);

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
                .then(() => {
                    // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                    handlePageChange(currentPage);
                    addAlert('¡Creado Correctamente!', 'success', doneLine);

                    setSelectedRow(null);


                })
                .catch(() => {
                    addAlert('¡Error al crear el reporte!', 'error', wrongLine);
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
                .then(() => {
                    // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                    handlePageChange(currentPage);
                    addAlert('¡Editado Correctamente!', 'success', doneLine);

                    setSelectedRow(null);

                })
                .catch(() => {
                    addAlert('¡Error al editar el reporte!', 'error', wrongLine);
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
            .then(() => {
                // Llama al servicio fetchPaginateReports después de que fetchCreateReports haya tenido éxito
                handlePageChange(currentPage);
                addAlert('¡Eliminado Correctamente!', 'success', doneLine);

            })
            .catch(() => {
                addAlert('¡Error al eliminar el reporte!', 'error', wrongLine);
            }).finally(() => {
            setFlag(!flag); // Establecer loading como false después de un breve tiempo de espera
        });
    };


    const addAlert = (message, type, img) => {
        const id = Math.random().toString(36).substr(2, 9); // Genera un ID único
        setAlerts(prevAlerts => [...prevAlerts, { id, message, type, img, isVisible: true }]);
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
        <div className="flex flex-col items-center mx-14 h-auto gap-4 md:flex-row py-12 md:py-0">
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

            <Alerts alerts={alerts} addAlert={addAlert} /> {/* Pasar addAlert como prop */}
        </div>

    );
}

export default GestionReportes;
