import { Outlet, Link } from "react-router-dom";
import AuthDetails from "../components/AuthDetails";
import React, { useEffect, useState } from 'react';


import {auth} from "../firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate ,useParams} from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";

export default function(){

   
    const navigate = useNavigate();

    const { numYear, yearId } = useParams();

    useEffect(()=>{

       if(numYear || yearId ){
            console.log('HOLAAA', numYear,yearId);
        }else{
            navigate("/dashboard");
        }
  
       //si no hay ningun parametro ir a dashboard
                //navigate("/dashboard");
           

        
     
      
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
                </ul>
            </nav>

            <div className="main-container">
         
            <Outlet />

            </div>
        </>
    )
}