import React from 'react';

function Alerts(props) {
    const { alerts } = props;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-4">
            {alerts.map(alert => (
                <div key={alert.id} role="alert"
                     className={`alert flex items-center text-white shadow-lg rounded transition-transform duration-500 ${alert.isVisible ? 'animate-slideIn' : 'animate-slideOut'} ${alert.type === 'success' ? 'alert-success bg-green-500' : 'alert-error bg-red-500'}`}>
                    <img src={alert.img} alt={alert.message}/>
                    <span>{alert.message}</span>
                </div>
            ))}
        </div>
    );
}

export default Alerts;