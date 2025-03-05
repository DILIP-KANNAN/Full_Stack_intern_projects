import React, { useState, useEffect } from "react";
import "./styles/MainPage.css";
import ProductRow from "./ProductRow";
import SellerRow from "./SellerRow";
import SellerDetailsModal from "./SellerDetailsModal";
import CropDetailsModal from "./CropDetailsModal";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import Cart from "./Cart";

const MainPage = () => {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

const addToCart = async (item, quantity) => {
  try {
    // Fetch image URL from cropImages collection
    const imageQuery = query(collection(db, "cropImages"), where("crop_variety", "==", item.crop_variety));
    const imageData = await getDocs(imageQuery);
    const imageUrl = !imageData.empty ? imageData.docs[0].data().image_url : "default_image.jpg";

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(cartItem =>
        cartItem.seller_name === item.seller_name && cartItem.crop_variety === item.crop_variety
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevItems];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevItems, { ...item, quantity, image_url: imageUrl }];
      }
    });

    // Show success message
    setMessage("Item Added to Cart!");
    setTimeout(() => setMessage(""), 2000);
  } catch (error) {
    console.error("Error fetching image for cart:", error);
  }
};

  const updateCartQuantity = (index, change) => {
    setCartItems(prevItems => {
      const updatedCart = [...prevItems];
      updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity + change);
      return updatedCart;
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const showDetails = (crop) => {
    setSelectedCrop(crop);
  };

  const closeModal = () => {
    setSelectedCrop(null);
  };

  const handleCartOutsideClick = (event) => {
    if (event.target.classList.contains("cart-overlay")) {
      setCartOpen(false);
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Agrosphere</div>
        <div className="header-buttons">
          <img className="user" width="50" height="50" src="https://img.icons8.com/stickers/50/user-male-circle.png" alt="user-male-circle" onClick={() => navigate("/profile")} />
          <img className="cart" width="48" height="48" src="https://img.icons8.com/emoji/48/shopping-cart-emoji.png" alt="shopping-cart-emoji" onClick={() => setCartOpen(!cartOpen)}/>
        </div>
      </header>

      <div className="post-head">
        
        <SearchBar setSelectedCrop={setSelectedCrop} setSelectedSeller={setSelectedSeller} />
        {/* About Section */}
        <section className="about">
          <h2>Straight from the farm</h2>
          <p><b>Empowering Farmers, Connecting Consumers </b><br/></p>
        </section>
        {message && <div className="success-message">{message}</div>}
        {/* Product Row */}
        <div className="last">
          <ProductRow showDetails={showDetails} />
          {selectedCrop && <CropDetailsModal selectedCrop={selectedCrop} closeModal={closeModal} addToCart={addToCart} />}
          <SellerRow showSellerDetails={setSelectedSeller} />
          {selectedSeller && <SellerDetailsModal selectedSeller={selectedSeller} closeModal={() => setSelectedSeller(null)} addToCart={addToCart} />}
        </div>
        <div className="over">
          <div className="about1">
            <h1>About Agrosphere</h1>
            <p>At <b>Agrosphere</b>, we revolutionize the agricultural market by providing <b>direct access</b> between farmers and consumers. By eliminating intermediaries, our platform ensures that farmers receive <b>fair prices</b> for their produce, increasing their income and financial stability. Buyers, whether households or retailers, benefit from <b>fresh, locally sourced products</b> at competitive prices.<br/><br/>One of Agrosphere’s standout features is its <b>smart negotiation tools</b>, allowing farmers and buyers to discuss and finalize prices seamlessly. Additionally, our <b>geolocation-based search</b> helps buyers discover nearby farmers, reducing transportation costs and promoting sustainability.<br/><br/>For small-scale farmers, we offer an <b>innovative storage model</b>, where urban retail shop owners provide storage space for fresh produce, enabling easy distribution to city customers. Our IoT-driven freshness monitoring ensures real-time quality checks, boosting consumer confidence in every purchase.<br/><br/>With Agrosphere, we create a <b>transparent, efficient, and profitable</b> ecosystem where farmers thrive, consumers enjoy quality products, and local economies grow. This is more than just a marketplace—it’s a movement towards a fair and sustainable agricultural future. 🌱🚜</p>
          </div>
        </div>
      </div>
      <Cart cartOpen={cartOpen} cartItems={cartItems} setCartOpen={setCartOpen} updateCartQuantity={() => {}} removeFromCart={() => {}} />
    </div>
  );
};
export default MainPage;
