import React, { useEffect } from 'react';


export default function(){
    const test = function(){
        console.log('hello');
    }

    useEffect(() => {
        test();
    }, []);

    return(
        <>
            <div className="login-container">
               <form className="form">

                <label>Email</label>
                <input type="email" name="email" id="email"></input>

                <label>Password</label>
                <input type="password" name="password" id="password"></input>

               </form>
            </div>
        </>
        
    )
}