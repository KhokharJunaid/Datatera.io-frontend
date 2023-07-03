import React from "react";
import styles from "../EmailSend/EmailSend.module.css";
import logo from "../../assets/images/logo.jpg";
import success from "../../assets/images/tick.png";

function EmailSend() {
  return (
    <div className={styles.signin_main}>
      <div className={styles.pic_div}>
        <img src={logo} className={styles.logo} alt="logo" />
      </div>
      <div className={styles.signinUpper}>
        <div className={styles.signin}>
          <div className={styles.success_main}>
            <img src={success} className={styles.success} alt="success" />
          </div>
          <h6 className={styles.login_heading}>Email sent successfully!</h6>
          <p className={styles.explore_future_heading}>
            Please check your inbox and make sure to check spam as well.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailSend;
