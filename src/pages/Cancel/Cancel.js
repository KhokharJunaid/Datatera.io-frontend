import React from 'react';
import styles from '../DoneSubcribe/DoneSubscribe.module.css';
import logo from '../../assets/images/logo.jpg';
import success from '../../assets/images/icon.png';
import { Button } from '@mui/material';

const Cancel = () => {
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
          <p className={styles.explore_future_heading}>
            Please try again later
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

export default Cancel;
