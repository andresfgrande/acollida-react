/*import { Outlet, Link } from "react-router-dom";
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
            //TODO
        }else{
            navigate("/dashboard");
        }
  
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
}*/

import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from "react-router-dom";


export default function() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { numYear, yearId } = useParams();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (numYear || yearId) {
      // TODO
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
    <div className="header">
            <h3 className="header-title">Acollida</h3>
        </div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          {!isAuthenticated ? (
            <>
              <li>
                <Link to={`login`}>Login</Link>
              </li>
              <li>
                <Link to={`register`}>Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={`dashboard`}>Dashboard</Link>
              </li>
              <li>
                <Link to={`account`}>Mi Cuenta</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <div className="main-container">
        <Outlet />
      </div>
    </>
  );
}
