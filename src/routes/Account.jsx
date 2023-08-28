import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";

export default function(){

    const [user, setUser] = useState(null);
  
    const navigate = useNavigate();

    async function loadUserData(userId) {
        const userRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
          
            setUser(userDoc.data());
            
        } else {
            console.log("No such user!");
        }
    }


    useEffect(()=>{
  
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
               loadUserData(user.uid)
                navigate("/account");
            }else{
                navigate("/login");
            }
        });

        return ()=>{
            listen();          
        }
     
      
    },[])

    return (
        <div className="account-container">
            <h1>Mi Cuenta</h1>
            {user ? (
                <div className="user-card">
                    <div className="user-detail">
                        <label>Name:</label>
                        <span>{user.name}</span>
                    </div>
                    <div className="user-detail">
                        <label>Surname:</label>
                        <span>{user.surname}</span>
                    </div>
                    <div className="user-detail">
                        <label>Email:</label>
                        <span>{user.email}</span>
                    </div>
                    <div className="user-detail">
                        <label>Precio normal:</label>
                        <span>{user.normal_price}</span>
                    </div>
                    <div className="user-detail">
                        <label>Precio hermanos:</label>
                        <span>{user.siblings_price}</span>
                    </div>
                    <div className="user-detail">
                        <label>Hora finalización:</label>
                        <span>{user.final_hour}</span>
                    </div>
                    {/* Add other properties as needed */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
    
    
}