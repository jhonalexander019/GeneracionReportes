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

const fetchPaginateReports = async (page, accessToken, handleTokenRefresh) => {
    try {
        let [response] = await Promise.all([fetch(`https://back.reportmanagemet.software/reports?page=${page}&pageSize=10`, {
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

export { refreshAccessToken, fetchPaginateReports, fetchCreateReports, fetchUpdateReports, fetchDeleteReports};
