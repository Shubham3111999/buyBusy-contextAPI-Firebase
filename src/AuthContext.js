import { createContext, useContext, useState } from "react";
import React from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase-init"
import {  toast } from 'react-toastify';



const authContext = createContext();

//custom hook
export const useAuthContextValue = () => {
  return useContext(authContext)
}

export default function AuthContext({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  //handle signin 
  const handleSignIn = (e, email, password, navigate) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password).then(() => {
      setIsLoggedIn(true);

      localStorage.setItem("loggedInObj", JSON.stringify({ isLoggedIn: true, exTime: new Date().getTime() + (60 * 60 * 1000) }));  //to  persist logged in state
      navigate("/");

    }).catch((error) => {
      toast.error(error.message.slice(9))
    })

  };

  //handle signUp
  const handleSignUp = (e, email, password, navigate) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoggedIn(true);

        localStorage.setItem("loggedInObj", JSON.stringify({ isLoggedIn: true, exTime: new Date().getTime() + (60 * 60 * 1000) }));  //to  persist logged in state

        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message.slice(9))
      });

  };

  //handle sign out
  const signOutHandler = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      localStorage.setItem("loggedInObj", JSON.stringify({ isLoggedIn: false, exTime: new Date().getTime() }));
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <authContext.Provider value={{ setIsLoggedIn, isLoggedIn, handleSignIn, handleSignUp, signOutHandler }}>
      {children}
    </authContext.Provider>
  )
}
