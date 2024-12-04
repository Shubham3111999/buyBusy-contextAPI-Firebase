import Cart from "./Component/Cart";
import Home from "./Component/Home";
import Navbar from "./Component/Navbar";
import OrderList from "./Component/OrderList";
import SignIn from "./Component/SignIn";
import SignUp from "./Component/SignUp";

import AuthChecker from "./AuthChecker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {createBrowserRouter,RouterProvider,Outlet} from "react-router-dom"


function App() {

  

  const routers=createBrowserRouter([
    {
      path:"/",element:<><Navbar/><Outlet/></>,

      children:[
        {path:"/",element:<Home/>},
        {path:"/cart",element:<AuthChecker><Cart/></AuthChecker>},
        {path:"/orders",element:<AuthChecker><OrderList/></AuthChecker>},
      ]
    },
    { path:"/signIn",element:<SignIn/> },
    { path:"/signUp",element:<SignUp/>}

  ])


  return (
    <div className="App">
       <RouterProvider router={routers}/>
       <ToastContainer />
    </div>
  );
}

export default App;
