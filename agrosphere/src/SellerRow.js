import "./styles/card.css";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import SellerCard from "./SellerCard";

const SellerRow = ({ showSellerDetails }) => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const sellerQuery = await getDocs(collection(db, "sellers"));
        const sellerList = sellerQuery.docs.map(doc => doc.data());
        setSellers(sellerList);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div className="seller-row">
      <h2>Top Sellers</h2>
      <div className="seller-list">
        {sellers.map((seller, index) => (
          <SellerCard key={index} seller={seller} showSellerDetails={showSellerDetails} />
        ))}
      </div>
    </div>
  );
};

export default SellerRow;
