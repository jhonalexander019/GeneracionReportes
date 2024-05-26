import React, {useEffect, useState} from 'react';
import eyeLineIcon from "../Util/SVG/eyeLine.svg";
import eyeGlyphIcon from "../Util/SVG/eyeGlyph.svg";
import deleteIcon from "../Util/SVG/delete.svg";
import SkeletonTable from "../Util/Skeletons/SkeletonTable";

const Table = ({ header, body, handleButtonClick, handleDeleteButtonClick, selectedButtonIndex, loading, onPageChange, page }) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(page);
    }, [page]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Actualiza el estado
        onPageChange(pageNumber || 1); // Llama a onPageChange con el nuevo número de página
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

    const filterRowData = (row) => {
        // Filtra los datos de la fila según las claves del encabezado
        const filteredData = {};
        header.forEach((key) => {
            filteredData[key] = row[key];
        });
        return filteredData;
    };
    return (
        <div className="flex flex-col items-center w-full md:w-1/2">
            {loading ? (
                <SkeletonTable />
            ) : (
                <table className="w-full overflow-hidden shadow-xl rounded-lg mb-3">
                    <thead>
                    <tr className="h-10">
                        {header.map((item, index) => (
                            <th key={index}
                                className={`${index === 0 && item === 'ID' ? 'w-1.5' : 'w-40'}`}>
                                {item}
                            </th>
                        ))}

                        <th className="w-32 text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        {body.map((row, rowIndex) => (
                            <tr key={rowIndex} className="h-11 bg-transparent">
                                {Object.values(filterRowData(row)).map((value, columnIndex) => (
                                    <td className="pl-5" key={columnIndex}>{value}</td>
                                ))}
                                <td>
                                    <div className="actions">
                                        <button onClick={() => handleButtonClick(rowIndex, row)}>
                                            <img
                                                src={rowIndex === selectedButtonIndex ? eyeLineIcon : eyeGlyphIcon}
                                                alt={rowIndex === selectedButtonIndex ? "Reporte sin visualizar" : "Reporte visualizado"}
                                            />
                                        </button>
                                        <button onClick={() => handleDeleteButtonClick(rowIndex, row)}>
                                            <img src={deleteIcon} alt="Eliminar"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="flex gap-2">
                {renderPageButtons()}
            </div>
        </div>
    );
};

export default Table;
