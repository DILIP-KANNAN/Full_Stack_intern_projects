import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./styles/SellerDetailsModal.css";

const SellerDetailsModal = ({ selectedSeller, closeModal, addToCart }) => {
  const [sellerDetails, setSellerDetails] = useState(null);
  const [cropVarieties, setCropVarieties] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (!selectedSeller) return;

      try {
        // Fetch seller details
        const sellerQuery = query(collection(db, "sellers"), where("name", "==", selectedSeller));
        const sellerData = await getDocs(sellerQuery);
        if (!sellerData.empty) {
          setSellerDetails(sellerData.docs[0].data());
        }

        // Fetch crop varieties sold by this seller
        const cropQuery = query(collection(db, "cropVarieties"), where("seller_name", "==", selectedSeller));
        const cropData = await getDocs(cropQuery);
        const cropList = cropData.docs.map(doc => doc.data());
        setCropVarieties(cropList);        
        console.log(cropList);
        const imageQuery = await getDocs(collection(db, "cropImages"));
        const imageMapping = {};
        imageQuery.docs.forEach(doc => {
          const data = doc.data();
          imageMapping[data.crop_variety] = data.image_url; // Map crop variety to image URL
        });

        setImageMap(imageMapping);
    } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    fetchSellerDetails();
  }, [selectedSeller]);

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeModal();
  };

  // Update quantity per crop
  const updateQuantity = (crop, change) => {
    setQuantities(prev => {
      const newQty = (prev[crop.crop_variety] || 1) + change;
      return { ...prev, [crop.crop_variety]: newQty > 0 ? newQty : 1 };
    });
  };

  if (!selectedSeller || !sellerDetails) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content-2">
        {
          console.log(cropVarieties)
        }
        <button className="close-btn" onClick={closeModal}>X</button>
        <img className="seller-image" src={sellerDetails.image_url || "https://img.icons8.com/color/48/farmer-male--v1.png"} alt={selectedSeller} />
        <h2>{sellerDetails.name}</h2>
        <p>📍 {sellerDetails.locality}   ||      📞 {sellerDetails.contact_no}</p>

        <h3>Crops Sold:</h3>
        <div className="crop-list">
          {cropVarieties.map((crop, index) => (
            <div className="crop-item" key={index}>
              <img className="crop-icon" src={imageMap[crop.crop_variety] || "/default_crop.jpg"} alt={crop.crop_variety} />
              <div className="crop-info">
                <h4>{crop.crop_variety}</h4>
                <p>{crop.price}rs/kg</p>
                <p>📦 {crop.quantity} kg available</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(crop, -1)}>-</button>
                  <span>{quantities[crop.crop_variety] || 1}</span>
                  <button onClick={() => updateQuantity(crop, 1)}>+</button>
                </div>
                <button onClick={() => addToCart({ ...crop, seller_name: selectedSeller }, quantities[crop.crop_variety] || 1)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDetailsModal;
