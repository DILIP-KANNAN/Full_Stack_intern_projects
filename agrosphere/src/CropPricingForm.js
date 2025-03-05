import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import "./styles/auth.css";

const CropPricingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, cropVarieties } = location.state || {}; // Receive crop varieties from SellerDetailsForm.js

  const [cropData, setCropData] = useState(
    cropVarieties.map((crop) => ({ crop_variety: crop, price: "", quantity: "" }))
  );

  const handleChange = (index, field, value) => {
    const updatedData = [...cropData];
    updatedData[index][field] = value;
    setCropData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) return alert("User not authenticated!");

      for (let crop of cropData) {
        await addDoc(collection(db, "cropVarieties"), {
          crop_variety: crop.crop_variety,
          price: crop.price,
          quantity: crop.quantity,
          seller_name: name, // Store seller's name
        });
      }

      alert("Crop pricing saved!");
      navigate("/login"); // Complete signup process
    } catch (error) {
      console.error("Error saving crop pricing:", error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Crop Pricing</h2>
      <p><strong>Seller Name:</strong> {name}</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        {cropData.map((crop, index) => (
          <div key={index}>
            <input type="text" value={crop.crop_variety} disabled /> {/* ✅ Auto-filled crop name */}
            <input type="number" placeholder="Price" onChange={(e) => handleChange(index, "price", e.target.value)} required />
            <input type="number" placeholder="Quantity" onChange={(e) => handleChange(index, "quantity", e.target.value)} required />
          </div>
        ))}
        <button type="submit" className="auth-button">Finish</button>
      </form>
    </div>
  );
};

export default CropPricingForm;
