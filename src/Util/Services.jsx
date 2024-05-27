const refreshAccessToken = async (refresh_token) => {
    try {
        // Realizar la solicitud para obtener el nuevo token
        const response = await fetch("https://back.reportmanagemet.software/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh_token })
        });


        // Manejar errores de la solicitud de renovación de token
        if (response.ok) {
            const data = await response.json();
            const { token } = data;
            // Devolver el nuevo token de acceso
            return token;
        }
    } catch (error) {
        // Manejar errores de red u otros errores
        throw new Error("Error refreshing access token: " + error.message);
    }
};

const fetchPaginateReports = async (page, pageSize, accessToken, handleTokenRefresh) => {
    try {
        let [response] = await Promise.all([fetch(`https://back.reportmanagemet.software/reports?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })]);

        if (response.status === 401){
            handleTokenRefresh();
            await fetchPaginateReports(page, accessToken, handleTokenRefresh);
        }
        return response;// Devuelve la respuesta para que la función de promesa pueda manejarla
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error; // Lanza el error para que la función de promesa pueda manejarlo
    }
};

const fetchCreateReports = async (reportData, accessToken, handleTokenRefresh) => {
    try {
        let [response] = await Promise.all([fetch('https://back.reportmanagemet.software/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(reportData)
        })]); // Devuelve la respuesta para que la función de promesa pueda manejarla

        if (response.status === 401){
            handleTokenRefresh();
            await fetchPaginateReports(reportData, accessToken, handleTokenRefresh);
        }

        return response;// Devuelve la respuesta para que la función de promesa pueda manejarla
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error; // Lanza el error para que la función de promesa pueda manejarlo
    }
};

const fetchUpdateReports = async (id, reportData, accessToken, handleTokenRefresh) => {
    try {
        let [response] = await Promise.all([fetch(`https://back.reportmanagemet.software/reports/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(reportData)
        })]); // Devuelve la respuesta para que la función de promesa pueda manejarla

        if (response.status === 401){
            handleTokenRefresh();
            await fetchPaginateReports(id, reportData, accessToken, handleTokenRefresh);
        }

        return response;// Devuelve la respuesta para que la función de promesa pueda manejarla
    } catch (error) {
        handleTokenRefresh();
        console.error("Error fetching reports:", error);
        throw error; // Lanza el error para que la función de promesa pueda manejarlo
    }
};

const fetchDeleteReports = async (id, accessToken, handleTokenRefresh) => {
    try {
        let [response] = await Promise.all([fetch(`https://back.reportmanagemet.software/reports/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })]); // Devuelve la respuesta para que la función de promesa pueda manejarla

        if (response.status === 401){
            handleTokenRefresh();
            await fetchPaginateReports(id, accessToken, handleTokenRefresh);
        }

        return response;// Devuelve la respuesta para que la función de promesa pueda manejarla
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error; // Lanza el error para que la función de promesa pueda manejarlo
    }
};

const fetchReport = async (id, page, accessToken, handleTokenRefresh, filterValues) => {
    try {
        let queryParams = `page=${page}&limit=10&`;

        // Agregar filtros a los parámetros de consulta si existen
        if (filterValues) {
            queryParams += Object.keys(filterValues)
                .map(key => {
                    if (filterValues[key]) {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(filterValues[key])}`;
                    }
                    return ''; // Si el valor del filtro es falso, devolver una cadena vacía
                })
                .filter(Boolean) // Filtrar los valores falsos
                .join('&');
        }

        // Construir la URL con los parámetros de consulta
        const url = `https://back.reportmanagemet.software/report/${id}?${queryParams}`;

        let [response] = await Promise.all([fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })]);

        if (response.status === 401) {
            handleTokenRefresh();
            await fetchPaginateReports(id, accessToken, handleTokenRefresh);
        }

        return response;
    } catch (error) {
        console.error('Error fetching report:', error);
    }
}

const fetchExcelDownload = async (selectId, accessTokenPrefix, accessToken, filterValues) => {
    try {
        let queryParams = `${selectId}/${accessTokenPrefix}/excel?`;

        // Agregar filtros a los parámetros de consulta si existen
        if (filterValues) {
            queryParams += Object.keys(filterValues)
                .map(key => {
                    if (filterValues[key]) {
                        return `${encodeURIComponent(key)}=${encodeURIComponent(filterValues[key])}`;
                    }
                    return ''; // Si el valor del filtro es falso, devolver una cadena vacía
                })
                .filter(Boolean) // Filtrar los valores falsos
                .join('&');
        }

        let [response] = await Promise.all([fetch(`https://back.reportmanagemet.software/report/${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })]);

        return response;
        // Descargar el archivo o manejar la respuesta según sea necesario
    } catch (error) {
        console.error('Error downloading Excel file:', error);
    }
};


export { refreshAccessToken, fetchPaginateReports, fetchCreateReports, fetchUpdateReports, fetchDeleteReports, fetchReport, fetchExcelDownload};
