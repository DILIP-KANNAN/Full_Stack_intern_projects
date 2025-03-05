import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import "./styles/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import ProductRow from "./ProductRow";
import SellerRow from "./SellerRow";
import SearchBar from "./SearchBar";
import Cart from "./Cart";
import SellerDetailsModal from "./SellerDetailsModal";
import CropDetailsModal from "./CropDetailsModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [message, setMessage] = useState("");
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
  const closeModal = () => {
    setSelectedCrop(null);
  };
  const showDetails = (crop) => {
    setSelectedCrop(crop);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !user.email) return;

    const fetchUserData = async () => {
        try {
            // Fetch user type (buyer/seller)
            const userQuery = query(collection(db, "users"), where("email", "==", user.email));
            const userData = await getDocs(userQuery);
      
            if (!userData.empty) {
              const userDoc = userData.docs[0].data();
              setUsername(userDoc.name);
              const fetchedUserType = userData.docs[0].data().userType;
              setUserType(fetchedUserType);
            } else {
              console.log("User not found in Firestore.");
            }
           

        // Fetch orders if buyer
        if (userType === "buyer") {
          const ordersQuery = query(collection(db, "orders"), where("buyer_email", "==", user.email));
          const ordersData = await getDocs(ordersQuery);
          setOrderHistory(ordersData.docs.map(doc => doc.data()));

        }

        // Fetch sales if seller
        if (userType === "seller") {
          const salesQuery = query(collection(db, "sales"), where("seller_email", "==", user.email));
          const salesData = await getDocs(salesQuery);
          setSalesHistory(salesData.docs.map(doc => doc.data()));
        }
    }  catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, userType]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="profile-overlay">
        <div className="profile-content">
          <div className="close-butn"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/multiply.png" alt="multiply" onClick={() => navigate("/")} /></div>
          <h2>You haven't logged in</h2>
          <p>Please log in to access your profile.</p>
          <div className="but">
            <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          </div>          
        </div>
      </div>
    );
  }
  return (
    <div className="profile-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Agrosphere</div>
        <div className="header-buttons">
          <img width="48" height="48" src="https://img.icons8.com/cute-clipart/64/home.png"  className="home-btn" onClick={() => navigate("/")} alt="home"/>
          <img className="cart" width="48" height="48" src="https://img.icons8.com/emoji/48/shopping-cart-emoji.png" alt="shopping-cart-emoji" onClick={() => setCartOpen(!cartOpen)}/>
          <button className="logout-btn" onClick={handleLogout}> Logout</button>
        </div>
      </header>
      <div className="post-head">
        {/* Search Bar */}
        <SearchBar setSelectedCrop={setSelectedCrop} setSelectedSeller={setSelectedSeller} />
        {/* User Details */}
        <div className="user-info">
          <h2>Hello "{username || "User"}"</h2>
          <p>Your Email: {user.email}</p>
        </div>
        {message && <div className="success-message">{message}</div>}
        {/* Order/Sales History */}
        <div className="history-section">
          {userType === "buyer" ? (
            <>
              <h3>Order History</h3>
              {orderHistory.length > 0 ? (
                <ul>
                  {orderHistory.map((order, index) => (
                    <li key={index}>{order.crop_variety} - ${order.price} ({order.date})</li>
                  ))}
                </ul>
              ) : (
                <p>No previous orders.</p>
              )}
            </>
          ) : userType === "seller" ? (
            <>
              <h3>Sales History</h3>
              {salesHistory.length > 0 ? (
                <ul>
                  {salesHistory.map((sale, index) => (
                    <li key={index}>{sale.crop_variety} - ${sale.price} ({sale.date})</li>
                  ))}
                </ul>
              ) : (
                <p>No previous sales.</p>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div >
        <div className="last">{userType === "buyer" ? <ProductRow showDetails={showDetails} /> : userType === "seller" ? <SellerRow showSellerDetails={setSelectedSeller} /> : null}</div>
        <Cart cartOpen={cartOpen} cartItems={cartItems} setCartOpen={setCartOpen} updateCartQuantity={() => {}} removeFromCart={() => {}} />
        {selectedSeller && <SellerDetailsModal selectedSeller={selectedSeller} closeModal={() => setSelectedSeller(null)} addToCart={addToCart} />}
        {selectedCrop && <CropDetailsModal selectedCrop={selectedCrop} closeModal={closeModal} addToCart={addToCart} />}
      </div>
    </div>
  );
};

export default ProfilePage;
