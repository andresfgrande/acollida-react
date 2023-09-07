import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams, Link } from "react-router-dom";

import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";


export default function(){
    
    const [currentYear, setCurrentYear] = useState(null);
    const [kids, setKids] = useState(null);
    const [newKid, setNewKid] = useState({name: "", lastname : ""});

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

    async function createNewKid(kid){
     

      if(kid.name !== "" && kid.lastname !== ""){
        const newKidData = {
            fare: parseFloat(2.25),
            final_hour: '09:00',
            name: kid.name,
            surname: kid.lastname,
            months: {
              [monthId]: {
                'days':[],
                month_name: monthName,
                month_year: numYear,
                paid: false,
                total_hours: 0,
                total_minutes: 0,
                total_price: 0
              }
            }
        }

        try {
            const kidRef = await addDoc(collection(db, 'kids'), newKidData);
            const newKidId = kidRef.id;
            console.log("New kid created with ID: ", newKidId);

            await addNewKidToMonth(newKidData, newKidId);

            loadKidsFromMonth(monthId)
            setNewKid({name: "", lastname : ""});
            return newKidId;
        } catch (e) {
            console.error("Error adding new kid: ", e);
        }
      }

     
    }

    async function addNewKidToMonth(kidData, newKidId){
      console.log(kidData,'hellllllo');
      const newKidData = {
        [`kids.${newKidId}`]: {
          kid_id: newKidId,
          name: kidData.name,
          paid: false,
          surname: kidData.surname,
          total_hours: 0,
          total_price: 0
        }
      };

      console.log(newKidData,'hellllllo222');

      try {
        const monthRef = doc(db, 'months', monthId);
        await updateDoc(monthRef, newKidData);
      } catch (e) {
          console.error("Error adding new kid to month: ", e);
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
                 <Link to={`kid/${kids[kidKey].kid_id}`} key={index}>
                    <div className={`kid-card ${kids[kidKey].paid ? '' : 'not-paid'}`}  key={index} >
                        <h3>{kids[kidKey].name} {kids[kidKey].surname}</h3>
                        <p>Horas: {kids[kidKey].total_hours}</p>
                        <p>Monto: {kids[kidKey].total_price} €</p>
                        <p> {kids[kidKey].paid ? 'Pagado' : 'No pagado'}</p>
                    </div>
                </Link>
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
            <Link to={`/dashboard`} className="return-link month">
                <p>Volver a dashboard</p>
            </Link>
            {renderKids()}
            <div className="new-year-form-container">
              <form onSubmit={(e) => {
                  e.preventDefault();
                  createNewKid(newKid);
                  }}>
                  <label htmlFor="newKidName">Nombre:</label>
                  <input 
                  type="text" 
                  id="newKidName" 
                  value={newKid.name || ''} 
                  onChange={(e) => setNewKid({...newKid, name: e.target.value})} 
                  />
                  <label htmlFor="newKidLastname">Apellido:</label>
                  <input 
                  type="text" 
                  id="newKidLastname" 
                  value={newKid.lastname || ''} 
                  onChange={(e) => setNewKid({...newKid, lastname: e.target.value})} 
                  />
                  <button type="submit">Añadir</button>
              </form>
            </div>
        </>     
    )
}