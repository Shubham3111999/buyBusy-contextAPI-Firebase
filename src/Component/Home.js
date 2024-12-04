import React, { useState } from "react";
import "../CSS/Home.css";
import { useAuthContextValue } from "../AuthContext"
import { useEffect } from "react"
import { db } from "../firebase-init";
import { auth } from "../firebase-init";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { useProductContextValue } from "../ProductContext";
import Spinner from 'react-spinner-material';



const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [price, setPrice] = useState(1000);
    const [checkBoxFilterArray, setCheckBoxFilterArray] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    const authContextValue = useAuthContextValue();
    const authObject = JSON.parse(localStorage.getItem("loggedInObj"))

    const { getAllProductFromDb, products, setProducts, tempProducts, cartProducts, setCartProducts, updateCartInFirestore, handleAddToCart } = useProductContextValue();

    //handle search
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };


    //handle pricing
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    //handle category change
    const handleCategory = (e, category) => {

        if (e.target.tagName == "INPUT") {

            if (!checkBoxFilterArray.includes(category)) {
                setCheckBoxFilterArray([category, ...checkBoxFilterArray])
            } else {
                checkBoxFilterArray.splice(checkBoxFilterArray.indexOf(category), 1);
                setCheckBoxFilterArray([...checkBoxFilterArray])
            }

        }

    }


    //get product data
    useEffect(() => {

        getAllProductFromDb(setShowSpinner);  //used from product context


        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const docRef = doc(db, "cartProducts", currentUser.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCartProducts(docSnap.data());
                }
            }
        });   //get the cart products in local state if any

        return () => {
            unsubscribe();
        }

    }, [])

    useEffect(() => {

        //Search
        let searchProduct = tempProducts.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
        //setProducts(searchProduct);

        //category
        if (checkBoxFilterArray.length != 0) {
            searchProduct = searchProduct.filter((product) => checkBoxFilterArray.includes(product.category))
        }

        //price filteration
        if (price) {
            searchProduct = searchProduct.filter((product) => product.price <= price)
        }
        setProducts(searchProduct);
    }, [checkBoxFilterArray, searchQuery, price])



    useEffect(() => {
        updateCartInFirestore();  //used from context
    }, [cartProducts.cart])  //add cart product to firebasedb


    //to change localStorage state 
    useEffect(() => {
        setTimeout(() => {
            authContextValue.setIsLoggedIn(!authContextValue.isLoggedIn);
            localStorage.setItem("loggedInObj", JSON.stringify({ isLoggedIn: false, exTime: authObject.exTime }))
        }, authObject.exTime - new Date().getTime())
    }, [])  //after 1 hour make isLoggedIn status as false 
    //this is bacause we are setting authObject as valid for 1 hour when sign in and sign up



    return (
        <>
            {showSpinner ? <div className="home">
                <div className="filter">
                    <h2>Filter</h2>

                    <div className="filter-price">
                        <label>Price: {price}</label>
                        <input
                            type="range"
                            min="0"
                            max="1500"
                            value={price}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div className="filter-category">
                        <h3>Category</h3>
                        <div onClick={(e) => { handleCategory(e, "men's clothing") }}>
                            <input type="checkbox" id="mens-clothing" />
                            <label htmlFor="mens-clothing" >Men's Clothing</label>
                        </div>
                        <div onClick={(e) => { handleCategory(e, "women's clothing") }}>
                            <input type="checkbox" id="womens-clothing" />
                            <label htmlFor="womens-clothing">Women's Clothing</label>
                        </div>
                        <div onClick={(e) => { handleCategory(e, "jewelery") }}>
                            <input type="checkbox" id="jewelry" />
                            <label htmlFor="jewelry">Jewelry</label>
                        </div>
                        <div onClick={(e) => { handleCategory(e, "electronics") }}>
                            <input type="checkbox" id="electronics" />
                            <label htmlFor="electronics">Electronics</label>
                        </div>
                    </div>

                </div>

                <div className="products">

                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search By Name"
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    <div className="product-list">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">

                                <div className="productDetail">
                                    <img src={product.image} alt={product.title} />

                                </div>


                                <div className="addToCart">
                                    <h4>{product.title}</h4>
                                    <p>₹ {product.price}</p>
                                    <button onClick={() => handleAddToCart(product)}>Add To Cart</button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

            </div> : <div className="spinner"> <Spinner radius={120} color={"#333"} stroke={2} visible={true} /> </div>}
        </>

    );
};

export default Home;
