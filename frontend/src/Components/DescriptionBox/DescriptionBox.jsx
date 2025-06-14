import React from "react"
import "./DescriptionBox.css"

const DescriptionBox = () => {

    return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">
                    Description
                </div>
                <div className="descriptionbox-nav-box fade">
                    Reviews (122)
                </div>
            </div>

            <div className="descriptionbox-description">
                <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. 
                 It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers and conduct transactions
                 without the need for a physical presence. E-commerce websites have gained immesnse popularity due to their convenient accessibilty and the global reach they offer. </p>
                 <p>
                    E-commerce websites typcially display products or services along with  
                    detailed descriptions, images, prices and any available variations 
                    (e.g,, sizes, color). Each product usually has its own dedicated page
                    with relavent information.
                 </p>
            </div>

        </div>
    )
}


export default DescriptionBox