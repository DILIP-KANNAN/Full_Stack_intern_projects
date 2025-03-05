import "./styles/card.css";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "./ProductCard";

const ProductRow = ({ showDetails }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch crop varieties
        const productQuery = await getDocs(collection(db, "cropVarieties"));
        let productList = productQuery.docs.map(doc => doc.data());

        // Fetch images
        const imageQuery = await getDocs(collection(db, "cropImages"));
        const imageMap = {};
        imageQuery.docs.forEach(doc => {
          const data = doc.data();
          if (data.crop_variety && typeof data.crop_variety === "string") { // ✅ Ensure crop_variety exists
            imageMap[data.crop_variety.trim().toLowerCase()] = data.image_url;
          }
        });

        // Group products by crop variety
        const uniqueCrops = {};
        productList.forEach(product => {
          const cropType = product.crop_variety.trim().toLowerCase();
          if (!uniqueCrops[cropType]) {
            uniqueCrops[cropType] = {
              crop_variety: product.crop_variety,
              image_url: imageMap[cropType] || "default_image.jpg"
            };
          }
        });

        setProducts(Object.values(uniqueCrops));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-row">
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} showDetails={showDetails} />
        ))}
      </div>
    </div>
  );
};

export default ProductRow;
