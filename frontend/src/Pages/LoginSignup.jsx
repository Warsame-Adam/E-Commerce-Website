import React, { useState } from "react"
import "./CSS/LoginSignup.css"



const LoginSignup = () => {

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username:"",
        password:"",
        email:""
    })

    const changeHandler =(e)=>{
        console.log("Change handler executed");
        setFormData({...formData,
            [e.target.name]:e.target.value
        });

    }

    const Login = async ()=>{
        
        let responseData;
        await fetch(`${API_URL}/login`, {
            method:'POST',
            headers:{
                Accept:'application/json',
                "Content-Type":'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response)=>response.json()).then((data)=>responseData=data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors)
        }
        

    

    }

    const Signup = async ()=>{
        
        let responseData;
        await fetch(`${API_URL}/signup`, {
            method:'POST',
            
            headers:{
                Accept:'application/json',
                "Content-Type":'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response)=>response.json()).then((data)=>responseData=data);

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors)
        }
        

    }

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? 
                        <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" /> 
                        : 
                        <></>}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" />
                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" />
                </div>
                <button onClick={() => { state === "Login" ? Login() : Signup() }}>
                    Continue
                </button>
                {state === "Sign Up" ? 
                    <p className="loginsignup-login">
                        Already have an account? <span onClick={() => { setState("Login") }}>Login here</span>
                    </p> 
                    : 
                    <p className="loginsignup-login">
                        Create an account <span onClick={() => { setState("Sign Up") }}>Click here</span>
                    </p>}
                <div className="loginsignup-agree">
                    <input type="checkbox" name="" id="" />
                    <p>By continuing I agree to terms of use & privacy policy</p>
                </div>
            </div>
        </div>
    )
}


export default LoginSignup;
