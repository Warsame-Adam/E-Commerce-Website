import React from "react"
import "./Navbar.css"
import navlogo from "../../assets/nav-logo.svg"
import navProfileIcon from "../../assets/nav-profile.svg"

const Navbar = () => {
    return (
        <div className="navbar">
            <img src={navlogo} alt="" className="nav-logo" />
            <img src={navProfileIcon} alt="" className="nav-profile" />

        </div>
    )
}

export default Navbar;