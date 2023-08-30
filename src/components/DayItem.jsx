import React, {useEffect, useState} from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";

const DayItem = ({dayId}) =>{

    const [day, setDay] = useState(null);

    const navigate = useNavigate();
    
    async function loadDayData(dayId){
        const dayRef = doc(db, 'days', dayId);
        const dayDoc = await getDoc(dayRef);
        
        if (dayDoc.exists()) {
              console.log('day: ',dayDoc.data());
              setDay(dayDoc.data());
        } else {
                console.log("No such data!");
        }
    }
    
    useEffect(()=>{
        if(dayId){
            loadDayData(dayId)
        } 
    },[])

    return (
        <>
            {day ? (
                <tr>
                    <td>{day.day}</td>
                    <td>{day.initial_hour} - {day.final_hour}</td>
                    <td>{day.day_minutes}</td>
                    <td>{day.day_price}</td>
                </tr>
            ) : (
                <tr>
                    <td colSpan="4">No data...</td>
                </tr>
            )}
        </>
    )
}

export default DayItem;