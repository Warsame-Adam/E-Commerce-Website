import React, { useContext } from "react"
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";

import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const Product = () => {
 const {all_product} = useContext(ShopContext)
 const {productId} = useParams();
 const product = all_product.find((e) => e.id === Number(productId) )

 if (!product) {
    return <div>Loading...</div>;  // Show loading indicator or fallback content
 }

    return (
        <div>

            <Breadcrum product= {product} />
            <ProductDisplay product={product} />
            <DescriptionBox />
            <RelatedProducts />
            
        </div>

    )
}


export default Product;