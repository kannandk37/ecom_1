import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CustomerRievew from "../CustomerReview/CustomerRievew";

const Product = () => {
  const { productId } = useParams();

  const location = useLocation();

  const [product, setProduct] = useState({});
  const fetchProductById = async (id: any) => {
    setProduct({});
  };
  useEffect(() => {
    if (location?.state?.product?.id || productId) {
      let productIdDatum = location?.state?.product?.id || productId;
      fetchProductById(productIdDatum);
    }
  }, [location, productId]);
  return (
    <div>
      <CustomerRievew />
    </div>
  );
};

export default Product;
