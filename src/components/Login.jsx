import React, { useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Try to log in
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (loginErr) {
      try {
        // If login fails, try to sign up
        await createUserWithEmailAndPassword(auth, email, password);
        onLogin();
      } catch (signupErr) {
        setError("Login or Signup failed. Try again.");
        console.error(signupErr.message);
      }
    }
  };

  return (
    <div>
      <h2>Login or Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default Login;
