import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
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
        console.log('keyyy: ', yearKey);
        const selectedYear = user.years[yearKey];
        setCurrentYear(selectedYear);
        loadMonthsFromYear(selectedYear.id);
        console.log("current year: ", currentYear);
    };

    const renderYears = () => {
       
    
        if (user && user.years) {
            const yearsKeys = Object.keys(user.years);
            if (yearsKeys.length > 0) {
                return (
                    <div className="year-nav">
                        <ul className="year-list">
                            {yearsKeys.map((yearKey, index) => (
                                <li 
                                    key={index} 
                                    className="year-item"
                                    onClick={() => handleYearClick(yearKey)}
                                >
                                    {yearKey}
                                </li>
                            ))}
                        </ul>
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
                <h2 className='title-year'>{currentYear.name}</h2>
                {renderMonths()}
            </div>
        ) : (
            <p>Loading year data...</p>
        )}
       
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
        <button type="submit">Create New Year</button>
      </form>
    </div>
            <AuthDetails></AuthDetails>
        </>
        
    )
}