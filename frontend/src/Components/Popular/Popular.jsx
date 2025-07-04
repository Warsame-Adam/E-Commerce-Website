import React, { useEffect, useState } from "react"
import "./Popular.css"

import Item from "../Items/Items"


const Popular = () => {

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

    const [data_product, setData_Product] = useState([]);

    useEffect(()=>{
        fetch(`${API_URL}/popularinwomen`)
        .then((response)=>response.json())
        .then((data)=>setData_Product(data));
    },[]);

    
    return (

        <div className="popular">
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular-item">
                {data_product.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>

        </div>
    )
}

export default Popular;


