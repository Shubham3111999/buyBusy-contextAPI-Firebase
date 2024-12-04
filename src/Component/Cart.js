import React, { useEffect, useState } from "react";
import "../CSS/Cart.css";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-init";
import { auth } from "../firebase-init";
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from "react-router-dom";
import Spinner from 'react-spinner-material';
import { useProductContextValue } from "../ProductContext";
import { toast } from 'react-toastify';


const Cart = () => {
  const [render, setRender] = useState(0);
  const naviagate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(true);

  const { handleQuantityChange, cartItems, setCartItems, handleRemove } = useProductContextValue();


  //purchase handler - place order
  const purchaseHandler = async () => {

    if (cartItems.length == 0) {
      toast.error("Cart Is Empty !", { autoClose: 2000 })
      return;
    }

    const docRef = doc(db, "orderList", auth.currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //docSnap.data();   //add cartItems to this data
      await setDoc(doc(db, "orderList", auth.currentUser.email), {
        //orders: [cartItems, ...docSnap.data().orders]
        orders: [{ order: cartItems, createdAt: new Date().toISOString() }, ...docSnap.data().orders]
      }
      );
    } else {

      await setDoc(doc(db, "orderList", auth.currentUser.email), {
        orders: [{ order: cartItems, createdAt: new Date().toISOString() }]
      }
      );
    }

    //delete cart in db 
    await deleteDoc(doc(db, "cartProducts", auth.currentUser.email));
    setCartItems([]);   //empty cart
    naviagate("/orders")
  }

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      if (currentUser) {
        const docRef = doc(db, "cartProducts", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

          setCartItems(docSnap.data().cart);
        }

        setShowSpinner(false)
      }

    });   //get the cart products in local state if any


    return () => {
      unsubscribe();
    }
  }, [])  //get cart product from db


  useEffect(() => {

    if (render != 0) {   //avoid it at initial rendering

      if (cartItems.length == 0) {
        toast.error("Cart Is Empty !", { autoClose: 2000 })
      }

      (async () => {

        await setDoc(doc(db, "cartProducts", auth.currentUser.email), {
          email: auth.currentUser.email,
          cart: [...cartItems]
        }

        );
      })();
    }
    setRender(1);

  }, [cartItems])   //if cart quantity changes then update db also for persist data

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <div className="cart">
      <div className="cart-summary">
        <h2>TotalPrice: ₹{total.toFixed(2)}/-</h2>
        <button className="purchase-btn" onClick={purchaseHandler}>Purchase</button>
      </div>
      {showSpinner ? <div className="spinner"> <Spinner radius={120} color={"#333"} stroke={2} visible={true} /> </div>

        :
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} className="item-image" />
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => handleQuantityChange(item, -1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(item, 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item)}
                className="remove-btn"
              >
                Remove From Cart
              </button>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default Cart;
