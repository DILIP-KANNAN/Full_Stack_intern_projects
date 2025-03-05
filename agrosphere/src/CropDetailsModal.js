import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./styles/CropDetailsModal.css";

const CropDetailsModal = ({ selectedCrop, closeModal, addToCart }) => {
  const [sellers, setSellers] = useState([]);
  const [cropImage, setCropImage] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedCrop) return;

      try {
        // Fetch sellers for this crop
        const sellerQuery = query(collection(db, "cropVarieties"), where("crop_variety", "==", selectedCrop));
        const sellerData = await getDocs(sellerQuery);
        setSellers(sellerData.docs.map(doc => doc.data()));

        // Fetch crop image
        const imageQuery = query(collection(db, "cropImages"), where("crop_variety", "==", selectedCrop));
        const imageData = await getDocs(imageQuery);
        if (!imageData.empty) {
          setCropImage(imageData.docs[0].data().image_url);
        }
      } catch (error) {
        console.error("Error fetching crop details:", error);
      }
    };

    fetchDetails();
  }, [selectedCrop]);

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  // Update quantity per seller
  const updateQuantity = (seller, change) => {
    setQuantities(prev => {
      const newQty = (prev[seller.seller_name] || 1) + change;
      return { ...prev, [seller.seller_name]: newQty > 0 ? newQty : 1 }; // Prevent 0 quantity
    });
  };

  if (!selectedCrop) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>X</button>
        <h2>{selectedCrop}</h2>
        <img className="crop-image" src={cropImage || "default_image.jpg"} alt={selectedCrop} />
        
        <div className="seller-list">
          {console.log(sellers)}
          {sellers.map((seller, index) => (
            <div className="seller-item" key={index}>
              <img className="seler-image" src={seller.image_url || "https://img.icons8.com/color/48/farmer-male--v1.png"} alt={seller.seller_name} />
              <div className="seller-info">
                <h4>{seller.seller_name}</h4>
                <p>📍 {seller.locality}</p>
                <h3>{seller.price}rs/kg</h3>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(seller, -1)}>-</button>
                  <span>{quantities[seller.seller_name] || 1}</span>
                  <button onClick={() => updateQuantity(seller, 1)}>+</button>
                </div>
                <button onClick={() => addToCart(seller, quantities[seller.seller_name] || 1)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropDetailsModal;
