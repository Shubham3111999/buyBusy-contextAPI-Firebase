import React, { useState } from "react";
import { FaHome, FaShoppingCart, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { BsBasket } from "react-icons/bs";
import "../CSS/Navbar.css"; // Importing the CSS file
import { useAuthContextValue } from "../AuthContext"


import { Link } from "react-router-dom"
import { useProductContextValue } from "../ProductContext";


const Navbar = () => {
    const authObject = JSON.parse(localStorage.getItem("loggedInObj"))
    const { signOutHandler } = useAuthContextValue();
    const {setCartProducts}=useProductContextValue();


    return (
        <nav className="navbar">
            <div className="brand"><Link to="/" style={{ textDecoration: "none" }}>Busy Buy</Link></div>

            <ul className="nav-links">

                <li className="nav-item">
                    <FaHome /> <Link to="/">Home</Link>
                </li>

                {(authObject.isLoggedIn == true && authObject.exTime >= new Date().getTime()) ? (
                    <>
                        <li className="nav-item">
                            <BsBasket /> <Link to="/orders">My Orders</Link>
                        </li>
                        <li className="nav-item">
                            <FaShoppingCart /> <Link to="/cart" onClick={()=>setCartProducts({ cart: [] })}>Cart</Link>
                        </li>
                        <li
                            className="nav-item"
                        >
                            <FaSignOutAlt /> <Link onClick={signOutHandler}>Logout</Link>
                        </li>
                    </>
                ) : (
                    <li
                        className="nav-item"
                    >
                        <FaSignInAlt /> <Link to="/signIn">Sign In</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
