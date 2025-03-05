import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const SearchBar = ({ setSelectedCrop, setSelectedSeller }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (event) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      const searchTerm = searchQuery.trim().toLowerCase();

      try {
        // 🔍 Check if search term is a crop variety
        const cropQuery = query(collection(db, "cropVarieties"), where("crop_variety", "==", searchTerm));
        const cropResult = await getDocs(cropQuery);

        if (!cropResult.empty) {
          setSelectedCrop(searchTerm); // ✅ Show CropDetailsModal
          setSelectedSeller(null);
          return;
        }

        // 🔍 Check if search term is a seller name
        const sellerQuery = query(collection(db, "sellers"), where("name", "==", searchTerm));
        const sellerResult = await getDocs(sellerQuery);

        if (!sellerResult.empty) {
          setSelectedSeller(searchTerm); // ✅ Show SellerDetailsModal
          setSelectedCrop(null);
          return;
        }

        // ❌ No match found
        alert("No matching products or sellers found.");
      } catch (error) {
        console.error("Error searching:", error);
      }

      // Reset search input
      setSearchQuery("");
    }
  };

  return (
    <div className="search-bar">
      <img width="35" height="35" src="https://img.icons8.com/pastel-glyph/64/search--v2.png" alt="search" />
      <input
        type="text"
        placeholder="Search Products or Sellers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      <span className="filter-icon">☰</span>
    </div>
  );
};

export default SearchBar;
