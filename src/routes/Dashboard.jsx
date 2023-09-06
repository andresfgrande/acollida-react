import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link} from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";

export default function(){
    
    const [user, setUser] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [months, setMonths] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newYearName, setNewYearName] = useState("");
    const [newMonthName, setNewMonthName] = useState("");
  
    const navigate = useNavigate();

    async function loadUserData(userId) {
        const userRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userRef);
    console.log(userDoc.id,'heyyyyy');
        if (userDoc.exists()) {
            setUser(userDoc.data());
            setUserId(userDoc.id);
            let lastYear = getLastYear(userDoc.data());
            console.log('hey',lastYear);
            loadMonthsFromYear(lastYear.id);
            setCurrentYear(lastYear);
        } else {
            console.log("No such user!");
        }
    }

    async function loadMonthsFromYear(yearId){
    
        const yearRef = doc(db, 'years', yearId);
        const yearDoc = await getDoc(yearRef);
    
        if (yearDoc.exists()) {
          console.log(yearDoc.data().months);
          setMonths(yearDoc.data().months);
        } else {
            console.log("No such year!");
        }
    }

    async function createNewYear(yearName) {

        const newYearData = {
            name: yearName,
            months:{}
        };

        try {
            const yearRef = await addDoc(collection(db, 'years'), newYearData);
            const newYearId = yearRef.id;
            console.log("New year created with ID: ", newYearId);
            const updatedYear = await addNewYearToUser(newYearData.name, newYearId);
        
            setUser({
              ...user,
              years: {
                ...user.years,
                [newYearData.name]: updatedYear
              }
            });
        
            setCurrentYear(updatedYear);
            loadMonthsFromYear(newYearId);
        
            return newYearId;
          } catch (e) {
            console.error("Error adding new year: ", e);
          }
    }

    async function createNewMonth(monthName){

        const newMonthData = {
            name: monthName,
            year: currentYear,
            kids: {},    
        }

        try {
            const monthRef = await addDoc(collection(db, 'months'), newMonthData);
            const newMonthId = monthRef.id;
            console.log("New month created with ID: ", newMonthId);
            console.log(currentYear, ' CURRENT YEAR');

            await addNewMonthToYear(newMonthData.name, newMonthId);
            loadMonthsFromYear(currentYear.id);
        
            return newMonthId;
        } catch (e) {
            console.error("Error adding new month: ", e);
        }

    }

    async function addNewYearToUser(yearName, newYearId) {
        
        const newYearData = {
          [`years.${yearName}`]: {
            id: newYearId,
            name: yearName
          }
        };
      
        try {
            const userRef = doc(db, 'usuarios', userId);
            await updateDoc(userRef, newYearData);
        
            console.log("New year added to user: ", userId);
        
            return {
              id: newYearId,
              name: yearName
            };
        } catch (e) {
            console.error("Error adding new year to user: ", e);
        }
      }

    async function addNewMonthToYear (monthName, monthId){
        const newMonthData = {
            [`months.${monthId}`]: {
              month_id: monthId,
              name: monthName
            }
        };
        try {
            const yearRef = doc(db, 'years', currentYear.id);
            await updateDoc(yearRef, newMonthData);
        } catch (e) {
            console.error("Error adding new month to year: ", e);
        }
    }

    const getLastYear = (user) => {
        if (user && user.years) {
            const yearsKeys = Object.keys(user.years);
            if (yearsKeys.length > 0) {
                const sortedKeys = yearsKeys.sort((a, b) => a - b); 
                const lastYearKey = sortedKeys[sortedKeys.length - 1];
                return user.years[lastYearKey];
            }
        }
        return null;
    };

    useEffect(()=>{
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
                loadUserData(user.uid)
                navigate("/dashboard");
            }else{
                navigate("/login");
            }
        });

        return ()=>{
            listen();
        }
      
    },[])
  

    

    const handleYearClick = (yearKey) => {
        const selectedYear = user.years[yearKey];
        setCurrentYear(selectedYear);
        loadMonthsFromYear(selectedYear.id);
    };
    

    
    const renderYears = () => {
        if (user && user.years) {
            const yearsKeys = Object.keys(user.years);
            if (yearsKeys.length > 0) {
                return (
                    <div className="year-dropdown">
                        <select className='custom-select'
                            value={currentYear ? currentYear.name : ''} 
                            onChange={(e) => handleYearClick(e.target.value)}
                        >
                            <option value="" disabled>Select a year</option>
                            {yearsKeys.map((yearKey, index) => (
                                <option 
                                    key={index} 
                                    value={yearKey}
                                >
                                    {yearKey}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            } else {
                return <p>No years available.</p>;
            }
        } else {
            return <p>No years available.</p>;
        }
    };
    
    
    const renderMonths = () => {
        if (months) {
            const monthKeys = Object.keys(months);
            if (monthKeys.length > 0) {
                return (
                    <div className="container">
                        <div className="month-grid">
                            {monthKeys.map((monthKey, index) => (
                                <Link to={`year/${currentYear.name}/${currentYear.id}/month/${months[monthKey].name}/${months[monthKey].month_id}`} key={index}>
                                <div className="month-card" key={index}  >
                                    <h3>{months[monthKey].name}</h3>
                                </div>
                                </Link>
                                
                            ))}
                        </div>
                    </div>
                );
            } else {
                return <p className='no-data'>No months available.</p>;
            }
        } else {
            return <p>No months available.</p>;
        }
    };
    


    return(
        <>
            <h1>
            Dashboard
           
            </h1>
            
          
            {user ? (
                 
                <div>
                    {renderYears()}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            {currentYear ? (
            <div>
                {renderMonths()}
            </div>
        ) : (
            <p>Loading year data...</p>
        )}
       <div className='dashboard-forms'>
       <div className="new-year-form-container">
        <form onSubmit={(e) => {
            e.preventDefault();
            createNewYear(newYearName);
            }}>
            <label htmlFor="newYearName">Nuevo año:</label>
            <input 
            type="text" 
            id="newYearName" 
            value={newYearName} 
            onChange={(e) => setNewYearName(e.target.value)} 
            />
            <button type="submit">Añadir</button>
        </form>
        
        </div>

        <div className="new-year-form-container">
        <form onSubmit={(e) => {
            e.preventDefault();
            createNewMonth(newMonthName);
            }}>
            <label htmlFor="newMonthName">Nuevo mes:</label>
            <input 
            type="text" 
            id="newMonthName" 
            value={newMonthName} 
            onChange={(e) => setNewMonthName(e.target.value)} 
            />
            <button type="submit">Añadir</button>
        </form>
        
        </div>
       </div>
      
            
        </>
        
    )
}