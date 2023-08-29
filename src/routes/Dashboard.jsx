import React, { useEffect, useState } from 'react';
import {auth} from "../firebase";
import AuthDetails from "../components/AuthDetails";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore/lite';
import {db} from "../firebase";

export default function(){
    
    const [user, setUser] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [months, setMonths] = useState(null);
  
    const navigate = useNavigate();

    async function loadUserData(userId) {
        const userRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userRef);
    
        if (userDoc.exists()) {
            setUser(userDoc.data());
            let lastYear = getLastYear(userDoc.data());
            setCurrentYear(lastYear);
        } else {
            console.log("No such user!");
        }
    }

    async function loadMonths(yearId){
    
        const yearRef = doc(db, 'years', yearId);
        const yearDoc = await getDoc(yearRef);
    
        if (yearDoc.exists()) {
          console.log(yearDoc.data().months);
          setMonths(yearDoc.data().months);
        } else {
            console.log("No such year!");
        }
    }

    const getLastYear = (user) => {
        if (user && user.years) {
            const yearsKeys = Object.keys(user.years);
            if (yearsKeys.length > 0) {
                const sortedKeys = yearsKeys.sort((a, b) => a - b); // Sort numerically
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
                loadMonths('gCY9ag2GLH1qtaDmMfR9');
                navigate("/dashboard");
            }else{
                navigate("/login");
            }
        });

        return ()=>{
            listen();
        }
      
    },[])

    const renderYears = () => {
        if (user && user.years) {
            const yearsKeys = Object.keys(user.years);
            if (yearsKeys.length > 0) {
                return (
                    <ul>
                        {yearsKeys.map((yearKey, index) => (
                            <li key={index}>
                                Year: {yearKey}, Name: {user.years[yearKey].name}, ID: {user.years[yearKey].id}
                            </li>
                        ))}
                    </ul>
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
                    <ul>
                        {monthKeys.map((monthKey, index) => (
                            <li key={index}>
                                Month ID: {months[monthKey].month_id}, 
                                Name: {months[monthKey].name}
                            </li>
                        ))}
                    </ul>
                );
            } else {
                return <p>No months available.</p>;
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
                <h2>Year: {currentYear.name}</h2>
                {renderMonths()}
            </div>
        ) : (
            <p>Loading year data...</p>
        )}
            <AuthDetails></AuthDetails>
        </>
        
    )
}