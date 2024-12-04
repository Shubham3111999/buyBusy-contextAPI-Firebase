

import { Navigate } from "react-router-dom";

export default function AuthChecker({ children }) {
    
    //get auth localstorage object
    const authObject=JSON.parse(localStorage.getItem("loggedInObj"))
    
    if(authObject.isLoggedIn==true && authObject.exTime>= new Date().getTime()){
        return children;
    }else{
        return <Navigate to="/signIn" />
    }
   
}
