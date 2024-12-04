import React, { useState } from "react";
import "../CSS/SignIn.css";
import { useNavigate } from "react-router-dom"
import { useAuthContextValue } from "../AuthContext"

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const { handleSignUp } = useAuthContextValue();


  return (
    <div className="signin-container">
      <h1>Sign Up</h1>
      <form className="signin-form" onSubmit={(e) => handleSignUp(e, email, password, navigate)}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
