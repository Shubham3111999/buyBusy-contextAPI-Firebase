import { createContext, useContext, useState } from "react";
import { db } from "./firebase-init";
import { collection, onSnapshot } from "firebase/firestore"
import { auth } from "./firebase-init";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import {  toast } from 'react-toastify';

const productContext = createContext();

export const useProductContextValue = () => {
    return useContext(productContext)
}

export default function ProductContext({ children }) {

    const [products, setProducts] = useState([]);
    const [tempProducts, setTempProducts] = useState([]);
    const [cartProducts, setCartProducts] = useState({ cart: [] });
    const [cartItems, setCartItems] = useState([]);


    const authObject = JSON.parse(localStorage.getItem("loggedInObj"))
    
    //get all products from database
    const getAllProductFromDb=(setShowSpinner) => {
        onSnapshot(collection(db, 'products'), (snapShot) => {

            let dbProducts = snapShot.docs.map((doc) => {
                return {
                    ...doc.data()
                }
            })

            setProducts([...dbProducts])  //get all products from firestore databse
            setTempProducts([...dbProducts])
            setShowSpinner(true)
        })

    }

    //update cart in firestore
    const updateCartInFirestore = async () => {
        if (cartProducts.cart.length > 0) {
            await setDoc(doc(db, "cartProducts", cartProducts.email), cartProducts);
        }
    };

    //handle add to cart
    const handleAddToCart = (product) => {
        if (auth.currentUser != null && authObject.isLoggedIn == true) {

            const findIndex = cartProducts.cart.findIndex((prod) => prod.id == product.id)

            if (findIndex == -1) {
                setCartProducts(
                    {
                        email: auth.currentUser.email,
                        cart: [{ ...product, qty: 1 }, ...cartProducts.cart]
                    }
                )

            } else {
                cartProducts.cart[findIndex].qty++;
                setCartProducts(
                    {
                        email: auth.currentUser.email,
                        cart: [...cartProducts.cart]
                    }
                )

            }

            toast.success("Product Added Successfully" ,{autoClose: 2000})
        }

    }

    //adding qty to product in cart
    const handleQuantityChange = (item, delta) => {

        const itemToUpdate = cartItems.at(cartItems.indexOf(item))
    
        if (delta == 1) {
          itemToUpdate.qty++
        } else {
          if (itemToUpdate.qty > 1) {
            itemToUpdate.qty--
          }else{
            handleRemove(item)
          }
        }
    
        setCartItems([...cartItems])
    };

    //remove product from cart
    const handleRemove = (item) => {
        const indexToRemove = cartItems.indexOf(item);
        cartItems.splice(indexToRemove, 1);
        setCartItems([...cartItems])
        toast.success("Product Removed Successfully",{autoClose: 2000})
      };

    return (
        <productContext.Provider value={{getAllProductFromDb,products,setProducts,tempProducts,setTempProducts,cartProducts,setCartProducts,updateCartInFirestore,handleAddToCart,authObject,handleQuantityChange,cartItems, setCartItems,handleRemove}}>
            {children}
        </productContext.Provider>
    )
}