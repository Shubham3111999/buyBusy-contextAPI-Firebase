import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthContext from "./AuthContext";
import ProductContext from './ProductContext';


if (!localStorage.getItem("loggedInObj")) {  //if local storage value not available
    localStorage.setItem("loggedInObj", JSON.stringify({ isLoggedIn: false, exTime: new Date().getTime() }));
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContext>
        <ProductContext>
            <App />
        </ProductContext>
    </AuthContext>

);


