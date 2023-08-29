import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams  } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";


export default function(){
    
    //const [currentYear, setCurrentYear] = useState(null);
    const [kid, setKid] = useState(null);

    const { yearId, monthId, numYear, monthName, kidId } = useParams();
  
    const navigate = useNavigate();

  
    async function loadKidData(kidId){
        const kidRef = doc(db, 'months', kidId);
        const kidDoc = await getDoc(kidRef);
    
        if (kidDoc.exists()) {
          console.log('kid: ',kidDoc.data());
          setKid(kidDoc.data());
        } else {
            console.log("No such data!");
        }
    }

    useEffect(()=>{
       if(monthId){
        loadKidData(kidId)
       }   
    },[])

   


    return(
        <>
            <h1>
           Kid
            </h1>
            
        </>     
    )
}