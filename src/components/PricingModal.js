import React from "react";
import styles from "../components/PricingModal.module.css"
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";



function PricingModal( {plan}) {

  // const navigate = useNavigate()
  const nextPage = ( plan ) =>{
    console.log("plann==>" ,plan)
    
    // navigate("/done-subscribe")
  }

  const handleMailLinkClick = ( plan ) => {
    console.log("plan ====>", plan)
    // event.preventDefault();
    // const mailtoLink = 'mailto:mi5853361@gmail.com';
    // window.location.href = mailtoLink;
    
  };

   return (
    <div className={styles.your_plan}>
      <div className={styles.title}>
        <div>{plan?.title}</div>
        <div className={styles.p_color}>{plan?.price}</div>
      </div>
      <div className={styles.modal_btn}  >
          <Button variant="secondary" onClick={() => {plan?.btn_title === "Subscribe" ?  nextPage(plan?.title) : handleMailLinkClick(plan?.title)  } } disabled={plan?.title === "Free plan" ?  true : false} className={plan.title === "Free plan"?styles.freebtn:styles.btn}>
            {plan?.btn_title}
          </Button>
        </div>
        <div  className={styles.description}  >
            <div>
            <img  src={plan.title === "Free plan" ? "/icon_2.png" : "/icon_1.png"} alt="img"/>
            </div>
            <div>{plan?.d_1}</div>
        
        </div>
        <div  className={styles.description}  >
            <div>
            <img  src={plan.title === "Free plan" ? "/icon_2.png" : "/icon_1.png"} alt="img"/>
            </div>
            <div>{plan?.d_2}</div>
        
        </div>
        <div  className={styles.description}  >
            <div>
                <img  src={plan.title === "Free plan" ? "/icon_2.png" : "/icon_1.png"} alt="img"/>
            </div>
            <div>{plan?.d_3}</div>
        
        </div>
    </div>
  );
}

export default PricingModal;
