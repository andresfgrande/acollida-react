export default function(){
    return(
        <>
            <div className="register-container">
               <form className="form">

                <label>Name</label>
                <input type="text" name="name" id="name"></input>

                <label>Lastname</label>
                <input type="text" name="lastname" id="lastname"></input>

                <label>Email</label>
                <input type="email" name="email" id="email"></input>

                <label>Password</label>
                <input type="password" name="password" id="password"></input>

               </form>
            </div>
        </>
        
    )
}