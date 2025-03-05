import React from "react";

const SellerCard = ({ seller, showSellerDetails }) => {
  return (
    <div className="seller-card">
      <img width="48" height="48" src="https://img.icons8.com/color/48/farmer-male--v1.png" alt="farmer-male--v1"/>
      <h3>{seller.name}</h3>
      <p>{seller.locality}</p>
      <button onClick={() => showSellerDetails(seller.name)}>View Details</button>
    </div>
  );
};

export default SellerCard;
