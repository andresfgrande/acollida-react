import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams , Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";
import DayItem from '../components/DayItem';


export default function(){
    

    const [kid, setKid] = useState(null);

    const { yearId, monthId, numYear, monthName, kidId } = useParams();
  
    const navigate = useNavigate();

  
    async function loadKidData(kidId){
        const kidRef = doc(db, 'kids', kidId);
        const kidDoc = await getDoc(kidRef);
    
        if (kidDoc.exists()) {
          console.log('kid: ',kidDoc.data().months[monthId]);
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

   

    return (
        <>
         
            <div className="kid-container">
            <Link to={`/dashboard/year/${numYear}/${yearId}/month/${monthName}/${monthId}`} className="return-link">
                <p>Ver {monthName} {numYear}</p>
            </Link>
                {kid ? (
                    <>
                      <h1>{kid.name} {kid.surname}</h1>
                    <div className="kid-details">
                        <h2>{monthName} {numYear}</h2>
                        <div className="info-grid">
                        <div className="info-item">
                            <strong>Monto:</strong> <span>{kid.months[monthId].total_price}</span>
                        </div>
                        <div className="info-item">
                            <strong>Pagado:</strong> <span>{kid.months[monthId].paid ? 'Si' : 'No'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Horas:</strong> <span>{kid.months[monthId].total_hours}</span>
                        </div>
                        <div className="info-item">
                            <strong>Tarifa:</strong> <span>{kid.fare}</span>
                        </div>
                        <div className="info-item">
                            <strong>Minutos:</strong> <span>{kid.months[monthId].total_minutes}</span>
                        </div>
                       
                       
                    </div>
                        <table >
                            <thead>
                            <tr>
                            <th>Dia</th>
                            <th>Horas</th>
                            <th>Min.</th>
                            <th>Precio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {kid.months[monthId].days.map((dayId, index) => (
                                
                                    <DayItem key={dayId} dayId={dayId}></DayItem>
                                
            
                            ))}
                            </tbody>
                        </table>
                    </div>
                    </>
                ) : (
                    <p>Loading kid data...</p>
                )}
            </div>
        </>
    )
}