import { useEffect, useState } from "react";
import { getLocalProducts, LOCAL_PRODUCTS_EVENT } from "../utils/localProducts.js";

export const useLocalProducts = () => {
  const [products, setProducts] = useState(() => getLocalProducts());

  useEffect(() => {
    const syncProducts = () => setProducts(getLocalProducts());

    window.addEventListener(LOCAL_PRODUCTS_EVENT, syncProducts);
    window.addEventListener("storage", syncProducts);

    return () => {
      window.removeEventListener(LOCAL_PRODUCTS_EVENT, syncProducts);
      window.removeEventListener("storage", syncProducts);
    };
  }, []);

  return products;
};
