import React, { useEffect, useState } from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";


export default function(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const singIn = (e)=>{
        e.preventDefault();
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) =>{
            console.log(userCredential);
        }).catch((error)=>{
            console.log(error);
        })
    }

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
        
            <div className="login-container">
               <form className="form" onSubmit={singIn}>

                <label>Email</label>
                <input type="email" name="email" id="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                ></input>

                <label>Password</label>
                <input type="password" name="password" id="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}>

                </input>
                <button type="submit">Log In</button>

               </form>
            </div>
        </>
        
    )
}