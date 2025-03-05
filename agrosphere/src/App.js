import './App.css';import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./ProfilePage";
import SellerDetailsForm from "./SellerDetailsForm";
import CropPricingForm from "./CropPricingForm";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/seller-details" element={<SellerDetailsForm />} />
        <Route path="/crop-pricing" element={<CropPricingForm />} />
      </Routes>
    </Router>
  );
};

export default App;
