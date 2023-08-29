import { Outlet, Link } from "react-router-dom";
import AuthDetails from "../components/AuthDetails";
import React, { useEffect, useState } from 'react';

export default function(){

    useEffect(()=>{
    
    },[])
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
                    <li>
                    <Link to={`dashboard`}>Dashboard</Link>
                    </li>
                    <li>
                    <Link to={`account`}>Mi Cuenta</Link>
                    </li>
                    <li>
                    <Link to={`dashboard/year`}>Dashboard/year</Link>
                    </li>
                </ul>
            </nav>

            <div className="main-container">
         
            <Outlet />

            </div>
        </>
    )
}