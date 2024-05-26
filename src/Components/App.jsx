import "../Css/App.css";
import {Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function App() {
    return (
        <div className="flex m-0 p-0">
            <div className="fixed top-0 left-0 h-screen text-white z-50 md:max-w-52">
                <NavBar/>
            </div>
            <div className="flex-grow bg-gray-100 min-h-screen ml-24 md:ml-52 overflow-auto ">
                <Outlet/>
            </div>
        </div>

    );
}


export default App;
