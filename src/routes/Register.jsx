import React, { useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {db} from "../firebase";
import {collection, getDocs, doc, setDoc} from 'firebase/firestore/lite';

export default function(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');

    const navigate = useNavigate();

    const signUp = (e)=>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth,email,password)
        .then((userCredential) =>{
            createUser(userCredential.user.uid, name, lastname, email);
        }).catch((error)=>{
            console.log(error);
        })
    }

    async function createUser(userId, name, surname, email) {
        const userRef = doc(db, 'usuarios', userId);
        try {
            await setDoc(userRef, {
                name: name,
                surname: surname,
                email: email,
                normal_price: 2.25,
                siblings_price: 2,
                final_hour: "09:00",
                years: []
            });
            console.log("Document successfully written!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    }

    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
                navigate("/dashboard");
                //getUsuarios(db);

            }else{
                navigate("/register");
            }
        });        

        return ()=>{
            listen();
        }
      
    },[])

    return(
        <>
            <div className="register-container">
               <form className="form" onSubmit={signUp}>

                <label>Name</label>
                <input type="text" name="name" id="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                ></input>

                <label>Lastname</label>
                <input type="text" name="lastname" id="lastname"
                    value={lastname}
                    onChange={(e)=>setLastname(e.target.value)}
                ></input>

                <label>Email</label>
                <input type="email" name="email" id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                ></input>

                <label>Password</label>
                <input type="password" name="password" id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                ></input>

                <button type='submit'>Sign Up</button>

               </form>
            </div>
        </>
        
    )
}