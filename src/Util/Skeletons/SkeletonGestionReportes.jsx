import React from 'react';
import SkeletonTable from "./SkeletonTable";

const SkeletonGestionReportes = () => {
    return (
        <div className="flex flex-col justify-center items-center mx-20 h-screen gap-4 md:flex-row ">
            <SkeletonTable/>
            <div className="card w-full bg-transparent shadow-xl p-4 md:w-1/2">
                <h1 className="text-2xl font-extrabold mb-4">
                    <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
                </h1>
                <form className="card-body p-2 space-y-4">
                    <div className="form-control">
                        <label className="flex items-center mb-2">
                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </label>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="form-control mt-4">
                        <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkeletonGestionReportes;
