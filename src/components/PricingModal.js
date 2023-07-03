import React from "react";
import styles from "../components/PricingModal.module.css"
import { Button } from "@material-ui/core";

function PricingModal( {plan}) {
   return (
    <div className={styles.your_plan}>
      <div className={styles.title}>
        <div>{plan?.title}</div>
        <div className={styles.p_color}>{plan?.price}</div>
      </div>
      <div className={styles.modal_btn} >
          <Button variant="secondary" className={plan.title === "Free plan"?styles.freebtn:styles.btn}>
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
