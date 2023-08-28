import { Outlet, Link } from "react-router-dom";
export default function(){
    return(
        <>

        <div className="header">
            <h3 className="header-title">Acollida</h3>
        </div>
             <nav className="nav-bar">
                <ul>
                    <li>
                    <Link to={`login`}>Login</Link>
                    </li>
                    <li>
                    <Link to={`register`}>Register</Link>
                    </li>
                </ul>
            </nav>

            <div className="main-container">
         
            <Outlet />

            </div>
        </>
    )
}