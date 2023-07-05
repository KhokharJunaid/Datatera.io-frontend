import React from "react";
import styles from "./DoneSubscribe.module.css";
import logo from "../../assets/images/logo.jpg";
import success from "../../assets/images/tick.png";
import { Button } from "@mui/material";

const DoneSubscribe = () => {
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
          <h6 className={styles.login_heading}>Plus USD $49/month</h6>
          <p className={styles.explore_future_heading}>
            25 uploads daily. Extended file upload size. Extended URLs
            processing including secure websites.
          </p>
          <div className={styles.modal_btn}>
            <Button variant="secondary" className={styles.btn} href="/">
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoneSubscribe;
