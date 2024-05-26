import React, { useState, useEffect } from 'react';
import editLineIcon from "../Util/SVG/editLine.svg";
import editGlyphIcon from "../Util/SVG/editGlyph.svg";

function ReportsForm({ handleSubmit, selectedRow }) {
    const [editReport, setEditReport] = useState(false);
    const [reportData, setReportData] = useState({
        ID: '',
        SiteID: '',
        CreatedBy: '',
        DateCreate: '',
        Module: '',
        Name: '',
        Query: '',
        Graph: '',
        Status: '',
        Where: '',
        Headers: '',
    });

    useEffect(() => {
        if (selectedRow) {
            setReportData(selectedRow);
        } else {
            setEditReport(false);
            setReportData({
                ID: '',
                SiteID: '',
                CreatedBy: '',
                DateCreate: '',
                Module: '',
                Name: '',
                Query: '',
                Graph: '',
                Status: '',
                Where: '',
                Headers: ''
            });
        }
    }, [selectedRow]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitForm = (e) => {
        e.preventDefault();
        const action = selectedRow ? 'edit' : 'create';
        handleSubmit({ action, ...reportData });
    };

    const handleButtonEdit = (e) =>{
        setEditReport(!editReport)
    }

    return (
        <div className="card w-full bg-transparent shadow-xl p-4 md:w-1/2">
            <h1 className="text-2xl font-extrabold flex justify-between">
                {selectedRow ? 'Reporte' : 'Reporte nuevo'}
                <button onClick={() => handleButtonEdit()} className={`${selectedRow ? '' : 'hidden'}`}>
                    <img
                        src={!editReport ? editGlyphIcon : editLineIcon}
                        alt={editReport ? "Reporte sin visualizar" : "Reporte visualizado"}
                    />
                </button>
            </h1>
            <form onSubmit={submitForm} className="card-body p-2">
                <div className="form-control">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Nombre del Reporte
                    </label>
                    <input
                        type="text"
                        id="Name"
                        name="Name"
                        value={reportData.Name}
                        onChange={handleChange}
                        required
                        className="input input-bordered bg-white text-gray-700 disabled:bg-transparent disabled:text-gray-700 disabled:input-bordered"
                        disabled={(!editReport && selectedRow)}
                    />
                </div>
                <div className="form-control">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="query">
                        Consulta (Query)
                    </label>
                    <textarea
                        id="Query"
                        name="Query"
                        value={reportData.Query}
                        onChange={handleChange}
                        required
                        className="input input-bordered bg-white text-gray-700 disabled:bg-transparent disabled:text-gray-700 disabled:input-bordered h-36 resize-none"
                        disabled={(!editReport && selectedRow)}

                    />
                </div>
                <div className="form-control">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="where">
                        Condiciones (Where)
                    </label>
                    <textarea
                        id="Where"
                        name="Where"
                        value={reportData.Where}
                        onChange={handleChange}
                        required
                        className="input input-bordered bg-white text-gray-700 disabled:bg-transparent disabled:text-gray-700 disabled:input-bordered h-32 resize-none"
                        disabled={(!editReport && selectedRow)}

                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={`bg-[#413F54] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${(!editReport && selectedRow) ? 'hidden': ''}`}>
                        {selectedRow ? 'Editar Reporte' : 'Crear Reporte'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReportsForm;
