import React, { useEffect, useState } from "react"
import "./NewCollections.css"

import Item from "../Items/Items"



const NewCollections = () => {

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

    const [new_collection, setNew_Collection] = useState([])

    useEffect(()=>{
        fetch(`${API_URL}/newcollections`)
        .then((response)=>response.json())
        .then((data)=>setNew_Collection(data));

    },[]);
    

    return (
        <div className="new-collections">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {new_collection.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                 })}


            </div>

        </div>
    )
}


export default NewCollections