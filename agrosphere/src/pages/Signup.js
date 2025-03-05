import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import "../styles/auth.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("buyer");
    const navigate = useNavigate();
  
    const handleSignup = async (e) => {
      e.preventDefault();
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Save user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          userType,
          uid: user.uid,
        });
   
        alert("Signup Successful!");
        if (userType === "seller") {
          navigate("/seller-details", { state: { name, email } }); // Redirect to SellerDetailsForm.js
        } else {
          navigate("/login");
        }
      } catch (error) {
        alert(error.message);
      }
    };
  
    return (
      <div className="auth-container">
        <h2>Signup</h2>
        <form className="auth-form" onSubmit={handleSignup}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
  
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
  
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
  
          <label>User Type</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
  
          <button type="submit" className="auth-button">Signup</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    );
  };
  
  export default Signup;