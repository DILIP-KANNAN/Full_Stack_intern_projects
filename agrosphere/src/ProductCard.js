import React from "react";

const ProductCard = ({ product, showDetails }) => {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.crop_variety} />
      <div className="post">
        <h3>{product.crop_variety}</h3>
        <p>Click to know sellers</p>
        <button onClick={() => showDetails(product.crop_variety)}>Show Details</button>
      </div>
    </div>
  );
};

export default ProductCard;
