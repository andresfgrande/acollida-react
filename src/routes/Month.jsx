import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams  } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";


export default function(){
    
    const [currentYear, setCurrentYear] = useState(null);
    const [kids, setKids] = useState(null);

    const { yearId, monthId, numYear, monthName } = useParams();
  
    const navigate = useNavigate();

  
    async function loadKidsFromMonth(monthId){
        const monthRef = doc(db, 'months', monthId);
        const monthDoc = await getDoc(monthRef);
    
        if (monthDoc.exists()) {
          console.log(monthDoc.data().kids);
          setKids(monthDoc.data().kids);
        } else {
            console.log("No such year!");
        }
    }

    useEffect(()=>{
       if(monthId){
        loadKidsFromMonth(monthId)
       }   
    },[])

    const renderKids = () => {
        if (kids) {
          const kidKeys = Object.keys(kids);
          return (
            <div className="kids-grid">
              {kidKeys.map((kidKey, index) => (
                <div className={`kid-card ${kids[kidKey].paid ? '' : 'not-paid'}`}  key={index} >
                  <h3>{kids[kidKey].name} {kids[kidKey].surname}</h3>
                  <p>Horas: {kids[kidKey].total_hours}</p>
                  <p>Monto: {kids[kidKey].total_price} €</p>
                  <p> {kids[kidKey].paid ? 'Pagado' : 'No pagado'}</p>
                </div>
              ))}
            </div>
          );
        } else {
          return <p>No kids available.</p>;
        }
      };


    return(
        <>
            <h1>
            {monthName} {numYear}
            </h1>
            {renderKids()}
        </>     
    )
}