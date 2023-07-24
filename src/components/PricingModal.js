import React, { useContext } from 'react';
import styles from '../components/PricingModal.module.css';
import { Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { PlansContext } from '../context/plans/plans';

function PricingModal({ plan, userPlan: commingPlan, setPriceModalShow }) {
  const { userPlan, handleValidatePlan } = useContext(PlansContext);
  const navigate = useNavigate();
  const alreadySubscribed = async ({ plan }) => {
    try {
      const res = await api.post('/subscription/already-subscribed', {
        plan,
      });
      console.log('res==========>>>>>>', res);
      if (res.data) {
        toast('Your package activated successfully', { type: 'success' });
        handleValidatePlan();
        setPriceModalShow(false);
        navigate('/');
      }
    } catch (err) {
      console.log('err', err);
      navigate('/payment/plus');
      setPriceModalShow(false);
    }
  };

  const subscribePlan = async (plan) => {
    try {
      if (plan === 'FREE') {
        console.log('Free plan');
        const res = await api.post(`/user/subscription?plan=free`);
        if (res.data.message) {
          if (plan === 'FREE') {
            handleValidatePlan();
            toast('Your package activated successfully', { type: 'success' });
            setPriceModalShow(false);
            // } else {
            //   if (res.data.newSubscription) {
            //     navigate('/done-subscribe');
            //   } else {
            //     toast('Your package activated successfully', { type: 'success' });
            //     setPriceModalShow(false);
            //   }
          }
        }
      } else if ('PLUS') {
        alreadySubscribed({ plan: 'PLUS' });

        // navigate('/payment/plus');
        // setPriceModalShow(false);
      }
    } catch (error) {
      toast(error?.response?.data?.message, { type: 'error' });
    }
  };

  const enterpricePlan = async () => {
    const mailtoLink = 'mailto:contacts@datatera.io';
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.your_plan}>
      <div className={styles.title}>
        <div>{plan?.title}</div>
        <div className={styles.p_color}>{plan?.price}</div>
      </div>
      <div className={styles.modal_btn}>
        <a
          style={{ width: '100%' }}
          href={plan?.title === 'ENTERPRISE' && 'mailto:contacts@datatera.io'}
        >
          <Button
            onClick={() => {
              if (userPlan && userPlan[0]?.name !== plan?.title) {
                plan?.title === 'ENTERPRISE'
                  ? enterpricePlan()
                  : subscribePlan(plan?.title);
              }
            }}
            className={
              userPlan && userPlan[0]?.name === plan?.title
                ? styles?.freebtn
                : styles?.btn
            }
            style={
              userPlan && userPlan[0]?.name === plan?.title
                ? { cursor: 'not-allowed' }
                : {}
            }
          >
            {userPlan && userPlan[0]?.name === plan?.title
              ? 'Current plan'
              : plan?.btn_title}
          </Button>
        </a>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={
              userPlan && userPlan[0]?.name === plan?.title
                ? '/icon_2.png'
                : '/icon_1.png'
            }
            alt="img"
          />
        </div>
        <div>{plan?.d_1}</div>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={
              userPlan && userPlan[0]?.name === plan?.title
                ? '/icon_2.png'
                : '/icon_1.png'
            }
            alt="img"
          />
        </div>
        <div>{plan?.d_2}</div>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={
              userPlan && userPlan[0]?.name === plan?.title
                ? '/icon_2.png'
                : '/icon_1.png'
            }
            alt="img"
          />
        </div>
        <div>{plan?.d_3}</div>
      </div>
    </div>
  );
}

export default PricingModal;
