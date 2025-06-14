import React, { createContext, useEffect, useState } from "react"



export const ShopContext = createContext(null);

const getDefaultCart =() => {
    let cart = {};
    for  (let index=0; index < 300+1; index++) {
        cart[index] = 0
    }

    return cart;
}

const ShopContextProvider = (props) => {

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setcartItems] = useState(getDefaultCart);
    

    useEffect(()=>{
        fetch(`${API_URL}/allproducts`)
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if (localStorage.getItem('auth-token')){
            fetch(`${API_URL}/getcart`,{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:"",
            }).then((response)=>response.json())
            .then((data)=>setcartItems(data))
        }

    }, [])

    const addToCart = (itemId) => {
        

        setcartItems((prev)=> ({
            ...prev, [itemId]:prev[itemId]+1
        }));
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            
            
            fetch(`${API_URL}/addc`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                },
                body: JSON.stringify({ itemId: itemId })
            })
            .then(response => response.json())
            .then(data => console.log('Response data:', data))
            .catch(error => console.error('Fetch error:', error));
        } else {
            console.error('No auth token found');
        }
        
    


    }

    const removeFromCart = (itemId) => {

        setcartItems((prev)=> ({
            ...prev, [itemId]:prev[itemId]-1
        }));
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            
            
            fetch(`${API_URL}/removec`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                },
                body: JSON.stringify({ itemId: itemId })
            })
            .then(response => response.json())
            .then(data => console.log('Response data:', data))
            .catch(error => console.error('Fetch error:', error));
        } else {
            console.error('No auth token found');
        }
        
      


    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
      
        
        for (const item in cartItems) {
          
          if (cartItems[item] > 0) {
            
            let itemInfo = all_product.find((product) => product.id === Number(item));
      
            
            if (itemInfo) {
              
              totalAmount += itemInfo.new_price * cartItems[item];
            }
          }
        }
      
        
        return totalAmount;
      };

      const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item]> 0) {
                totalItem+=cartItems[item]
            }
        }
        return totalItem;
      }




    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart};

    


    return  (
        <ShopContext.Provider value ={contextValue} >

            {props.children}



        </ShopContext.Provider>
    )
}

export default ShopContextProvider;