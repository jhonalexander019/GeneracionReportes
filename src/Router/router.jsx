import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../Components/App';
import PrivateRoutes from '../Util/PrivateRoutes';
import SkeletonGestionReportes from "../Util/Skeletons/SkeletonGestionReportes";

// Lazy load the components
const Home = lazy(() => import('../Views/Home'));
const Reportes = lazy(() => import('../Views/Reportes'));
const GestionReportes = lazy(() => import('../Views/GestionReportes'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/Home',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: '/Reportes',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoutes>
                            <Reportes />
                        </PrivateRoutes>
                    </Suspense>
                ),
            },
            {
                path: '/Gestion-Reportes',
                element: (
                    <Suspense fallback={<SkeletonGestionReportes />}>
                        <PrivateRoutes>
                            <GestionReportes />
                        </PrivateRoutes>
                    </Suspense>
                ),
            },
            { path: '*', element: <Navigate to="/Home" /> },
        ],
    },
]);

export default router;
