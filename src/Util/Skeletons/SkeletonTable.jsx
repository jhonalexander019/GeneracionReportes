import React from 'react';

function SkeletonTable() {
    const skeletonData = Array.from({length: 10});

    return (
        <div className="flex flex-col items-center w-full md:w-1/2">
            <table className="w-full overflow-hidden shadow-xl rounded-lg mb-3">
                <thead>
                <tr className="h-10 bg-gray-300 animate-pulse">
                    <th className="w-10 ">
                        <div className="h-6 bg-gray-300 rounded"></div>
                    </th>
                    <th className="w-40">
                        <div className="h-6 bg-gray-300 rounded"></div>
                    </th>
                    <th className="w-32">
                        <div className="h-6 bg-gray-300 rounded"></div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {skeletonData.map((_, index) => (
                    <tr key={index} className="h-11 bg-gray-100 animate-pulse">
                        <td className="w-1.5 max-w-[120px] whitespace-nowrap">
                            <div className="h-6 bg-gray-300 rounded"></div>
                        </td>
                        <td className="w-40 max-w-[120px] whitespace-nowrap">
                            <div className="h-6 bg-gray-300 rounded"></div>
                        </td>
                        <td className="w-32">
                            <div className="flex justify-center gap-2">
                                <div className="w-6 h-6 pl-3 bg-gray-300 rounded-full"></div>
                                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="w-full flex justify-center mb-3">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="w-16 h-8 bg-gray-300 rounded-full mx-1 animate-pulse"></div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonTable;
