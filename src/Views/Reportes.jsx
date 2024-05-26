import "../Css/Reportes.css"

function Reportes() {
    // Arreglo de datos simulados
    const data = [
        { id: 1, nombre: 'Producto A', precio: 100 },
        { id: 2, nombre: 'Producto B', precio: 150 },
        { id: 3, nombre: 'Producto C', precio: 200 },
    ];

    // Obtener los nombres de las columnas
    const headers = Object.keys(data[0]);

    return (
        <div>
            <div className="title">
                <h1>Reporte de Servicios</h1>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>
                                <input type="text" placeholder={`Filtrar ${header}`} />
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {headers.map(header => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, columnIndex) => (
                                <td key={columnIndex}>{row[header]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reportes;
