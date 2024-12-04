import React, { useState, useEffect } from "react";
import "../CSS/SignIn.css";
import { Link, useNavigate } from "react-router-dom"
import { useAuthContextValue } from "../AuthContext"



const SignIn = () => {
  const { handleSignIn } = useAuthContextValue();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form className="signin-form" onSubmit={(e) => handleSignIn(e, email, password, navigate)}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Or <span className="signup-link"><Link to="/signUp">SignUp</Link></span> instead
      </p>
    </div>
  );
};

export default SignIn;
