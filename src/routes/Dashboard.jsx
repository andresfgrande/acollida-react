import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

export default function(){
    const navigate = useNavigate();

    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
                navigate("/dashboard");
            }else{
                navigate("/login");
            }
        });

        return ()=>{
            listen();
        }
      
    },[])

    return(
        <>
            <h1>
                Dashboard
            </h1>
            <AuthDetails></AuthDetails>
        </>
        
    )
}