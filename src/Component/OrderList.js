import React, { useEffect, useState } from 'react'
import Order from './Order';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-init";
import { auth } from "../firebase-init";
import { onAuthStateChanged } from 'firebase/auth';
import Spinner from 'react-spinner-material';
import { toast } from 'react-toastify';

export default function OrderList() {

  const [orders, setOrders] = useState([])
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, "orderList", currentUser.email);
        const docSnap = await getDoc(docRef);

        let updatedDb = [];
        if (docSnap.exists()) {
          let ordersDb = docSnap.data().orders.map((orderObj) => orderObj.order);

          ordersDb.forEach((array, ind) => {
            let temp = array.map(itemObj => { return { ...itemObj, createdAt: docSnap.data().orders[ind].createdAt } })

            updatedDb = [...updatedDb, temp]
          });

          setOrders(updatedDb);  //set orders states


        }

        if (updatedDb.length == 0) {
          toast.error("No Order Found !", { autoClose: 2000 })
        }


        setShowSpinner(false);  //make spinner false
      }

    });   //get the cart products in local state if any

    return () => {
      unsubscribe();
    }
  }, [])

  return (
    <div className='OrderList'>
      <h1 >Your Orders</h1>
      {showSpinner ? <div className="spinner"> <Spinner radius={120} color={"#333"} stroke={2} visible={true} /> </div> : orders.map((order, i) => <Order order={order} key={i} />)}
    </div>
  )
}
