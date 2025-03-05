import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import "./styles/auth.css";

const SellerDetailsForm = () => {
  const [contactNo, setContactNo] = useState("");
  const [cropVarieties, setCropVarieties] = useState([]);
  const [locality, setLocality] = useState("");
  const [largeScale, setLargeScale] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email } = location.state || {};

  const handleAddCrop = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setCropVarieties([...cropVarieties, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return alert("User not authenticated!");

      await setDoc(doc(db, "sellers", user.uid), {
        name: name,
        email: email,
        contact_no: contactNo,
        crop_varieties: cropVarieties,
        locality,
        large_scale: largeScale,
      });

      alert("Seller details saved!");
      navigate("/crop-pricing", { state: { name, cropVarieties} }); // Navigate to Crop Pricing Form
    } catch (error) {
      console.error("Error saving seller details:", error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Seller Details</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Contact Number</label>
        <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required />

        <label>Crop Varieties (Press Enter to Add)</label>
        <input type="text" onKeyDown={handleAddCrop} placeholder="Type and press Enter" />
        <ul>{cropVarieties.map((crop, index) => <li key={index}>{crop}</li>)}</ul>

        <label>Locality</label>
        <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} required />

        <label>
          <input type="checkbox" checked={largeScale} onChange={(e) => setLargeScale(e.target.checked)} />
          Large Scale Farming
        </label>

        <button type="submit" className="auth-button">Next</button>
      </form>
    </div>
  );
};

export default SellerDetailsForm;
