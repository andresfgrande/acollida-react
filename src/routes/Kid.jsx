import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useParams , Link } from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";
import DayItem from '../components/DayItem';


export default function(){
    

    const [kid, setKid] = useState(null);
    const [newDay, setNewDay] = useState({day: "", initial_hour : "", final_hour: '09:00'});

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

    function formatDayValues(dayData){

      //Dia fecha
      var fecha = dayData.day;
      dayData.day = fecha.split(" ")[0].split("-").reverse().join("/");

      //Dia minutos
      var init_hour = dayData.initial_hour;
      var final_hour = dayData.final_hour;

      var init_hour_array = init_hour.split(":");
      var final_hour_array = final_hour.split(":");

      var totalMinutosInicio = parseInt(init_hour_array[0])*60 + parseInt(init_hour_array[1]);
      var totalMinutosFinal = parseInt(final_hour_array[0]*60) + parseInt(final_hour_array[1]);
      dayData.day_minutes = totalMinutosFinal - totalMinutosInicio;

      //Dia precio
      var min = parseFloat(dayData.day_minutes);
      var fare = parseFloat(kid.fare);
      dayData.day_price = (min*((fare/60)*5))/5;

      return dayData;

    }

    function roundNumber(num){
        num = parseFloat(num);
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    async function createNewDay(dayData){

        if(dayData.day !== "" && dayData.initial_hour !== "" && dayData.final_hour !== ""){
            dayData = formatDayValues(dayData);

            const newDayData = {
                day: dayData.day,
                day_minutes: dayData.day_minutes,
                day_price: roundNumber(dayData.day_price),
                final_hour: dayData.final_hour,
                initial_hour: dayData.initial_hour,
              }
      
              try {
                  const dayRef = await addDoc(collection(db, 'days'), newDayData);
                  const newDayId = dayRef.id;
                  console.log("New day created with ID: ", newDayId);
      
                  await addNewDayToKid(newDayData, newDayId);
      
                  loadKidData(kidId)
              
                  setNewDay({day: "", initial_hour : "", final_hour: '09:00'});
                  return newDayId;
              } catch (e) {
                  console.error("Error adding new day: ", e);
              }
        }

        
    }

    async function addNewDayToKid(dayData, newDayId){
        
        var days = kid.months[monthId].days;
        days.push(newDayId);

        /**************/
        var total_minutes = parseInt(kid.months[monthId].total_minutes) + parseInt(dayData.day_minutes);
        var horas_float = parseInt(total_minutes)/60;
        var horas = parseInt(horas_float);
        var minutos = (horas_float - horas)*60
        var total_hours = horas + ":" + roundNumber(minutos);
        var total_price = roundNumber(parseFloat(kid.months[monthId].total_price) + parseFloat(dayData.day_price));
        /***************/

        const newDayData = {
            [`months.${monthId}.days`]: days,
            [`months.${monthId}.total_hours`]: total_hours,
            [`months.${monthId}.total_minutes`]: total_minutes,
            [`months.${monthId}.total_price`]: total_price,
        };
  
        console.log(newDayData,'NEW DAY DATA TEST 2');
  
        try {
          const kidRef = doc(db, 'kids', kidId);
          await updateDoc(kidRef, newDayData);
          await updateKidInMonth({total_hours: total_hours, total_price: total_price});
        } catch (e) {
            console.error("Error adding new day to kid: ", e);
        }
    }
    
    async function updateKidInMonth(dayData){
          try {
            const monthRef = doc(db, 'months', monthId);
            await updateDoc(monthRef, {
              [`kids.${kidId}.total_hours`]: dayData.total_hours,
              [`kids.${kidId}.total_price`]: dayData.total_price
            });
          } catch (e) {
            console.error("Error updating new day in month: ", e);
          }
    }

    async function setMonthPaid(state){
        const paidData ={
            [`months.${monthId}.paid`]: !state
        }

        try {
            const kidRef = doc(db, 'kids', kidId);
            await updateDoc(kidRef, paidData);
            await setMonthPaidInMonthView(state);
            loadKidData(kidId)
          } catch (e) {
              console.error("Error updating paid state: ", e);
        }
    }

    async function setMonthPaidInMonthView(state){
        const paidData = {
            [`kids.${kidId}.paid`]: !state,
        }

        try {
            const monthRef = doc(db, 'months', monthId);
            await updateDoc(monthRef, paidData);
        } catch (e) {
            console.error("Error updating paid state in month: ", e);
        }
    }

    async function switchPrice(fare){
        
        let newFare = fare === 2.25 ? 2 : 2.25;

        const fareData = {
            [`fare`]: newFare
        }

        try {
            const kidRef = doc(db, 'kids', kidId);
            await updateDoc(kidRef, fareData);
            loadKidData(kidId)
          } catch (e) {
              console.error("Error updating fare: ", e);
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
                            <strong>Monto:</strong> <span>{roundNumber(kid.months[monthId].total_price)}</span>
                        </div>
                        <div className={`info-item ${kid.months[monthId].paid ? 'paid' : 'not-paid'}`} >
                            <strong>Pagado:</strong> <span>{kid.months[monthId].paid ? 'Si' : 'No'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Horas:</strong> <span>{kid.months[monthId].total_hours}</span>
                        </div>
                        <div className="info-item">
                            <strong>{kid.fare === 2.25 ? 'Tarifa: ' :'Tarifa hermanos: '}</strong> <span>{kid.fare}</span>
                        </div>
                        <div className="info-item">
                            <strong>Minutos:</strong> <span>{kid.months[monthId].total_minutes}</span>
                        </div>
                        <div className='kid-actions'>
                            <button className='set-paid' onClick={()=>setMonthPaid(kid.months[monthId].paid)}>{kid.months[monthId].paid ? 'Marcar como no pagado' : 'Marcar como pagado'}</button>
                            <button className='switch-price' onClick={()=>switchPrice(kid.fare)}>Cambiar precio</button>
                        </div>
                        
                       
                       
                    </div>
                    <div className='table-container'>
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
                    </div>
                    </>
                ) : (
                    <p>Loading kid data...</p>
                )}
            </div>

            <div className="new-year-form-container">
              <form onSubmit={(e) => {
                  e.preventDefault();
                  createNewDay(newDay);
                  }}>
                  <label htmlFor="newDay">Nuevo dia:</label>
                  <input 
                  type="date" 
                  id="newDay" 
                  value={newDay.day || ''} 
                  onChange={(e) => setNewDay({...newDay, day: e.target.value})} 
                  />
                  <label htmlFor="initial_hour">Hora inicio:</label>
                  <input 
                  type="time" 
                  id="initial_hour" 
                  value={newDay.initial_hour || ''} 
                  onChange={(e) => setNewDay({...newDay, initial_hour: e.target.value})} 
                  />
                  <label htmlFor="final_hour">Hora fin:</label>
                  <input 
                  type="time" 
                  id="final_hour" 
                  value={newDay.final_hour || ''} 
                  onChange={(e) => setNewDay({...newDay, final_hour: e.target.value})} 
                  />
                  <button type="submit">Añadir</button>
              </form>
            </div>
        </>
    )
}