import React, { useEffect } from 'react';
import styles from './DoneSubscribe.module.css';
import logo from '../../assets/images/logo.jpg';
import success from '../../assets/images/tick.png';
import { Button, CircularProgress } from '@mui/material';
import api from '../../api';
import { useState } from 'react';
import { toast } from 'react-toastify';

const DoneSubscribe = () => {
  const [priceTag, setPriceTag] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const updatePaymentStatus = async ({ sessionId }) => {
    try {
      const res = await api.get('/subscription/update-payment-status', {
        params: {
          sessionId,
        },
      });
      console.log('res==========>>>>>>', res);
      if (res.data) {
        setIsLoading(false);
        // toast('Your package activated successfully', { type: 'success' });
        // handleValidatePlan();
        // setPriceModalShow(false);
        // navigate('/');
      }
    } catch (err) {
      console.log('err', err);
      toast('Your package activated successfully', { type: 'error' });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const sessionId = params.get('session_id');
    setPriceTag(params.get('priceTag'));
    updatePaymentStatus({ sessionId });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={styles.preLoader}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.signin_main}>
          <div className={styles.pic_div}>
            <img src={logo} className={styles.logo} alt="logo" />
          </div>
          <div className={styles.signinUpper}>
            <div className={styles.signin}>
              <div className={styles.success_main}>
                <img src={success} className={styles.success} alt="success" />
              </div>
              <h6 className={styles.login_heading}>Plus USD {priceTag}</h6>
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
      )}
    </>
  );
};

export default DoneSubscribe;
