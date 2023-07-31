import React, { useContext } from 'react';
import styles from '../components/PricingModal.module.css';
import { Button, CircularProgress } from '@material-ui/core';
import { toast } from 'react-toastify';
import api from '../api';
import { PlansContext } from '../context/plans/plans';
import { useState } from 'react';

function PricingModal({ plan, userPlan: commingPlan, setPriceModalShow }) {
  const { userPlan, handleValidatePlan } = useContext(PlansContext);
  const [isLoading, setIsLoading] = useState(false);

  const createSubSession = async ({ priceId, plan, priceTag }) => {
    try {
      setIsLoading(true);
      const res = await api.get('/subscription/create-checkout-session', {
        params: {
          priceId,
          plan,
          priceTag,
        },
      });
      if (res.data) {
        if (res.data.newSubscription === true) {
          window.location.replace(res.data.url);
          setIsLoading(false);
        } else {
          handleValidatePlan();
          setIsLoading(false);
          toast('Your package activated successfully', { type: 'success' });
          setPriceModalShow(false);
        }
      }
    } catch (err) {
      console.log('err', err);
      // navigate('/payment/plus');
      setPriceModalShow(false);
    }
  };

  const subscribePlan = async ({ plan, priceId, priceTag }) => {
    try {
      if (plan === 'FREE') {
        const res = await api.post(`/user/subscription?plan=free`);
        if (res.data.message) {
          handleValidatePlan();
          toast('Your package activated successfully', { type: 'success' });
          setPriceModalShow(false);
        }
      } else if (plan === 'PLUS') {
        createSubSession({ priceId, plan, priceTag });
      }
    } catch (error) {
      toast(error?.response?.data?.message, { type: 'error' });
    }
  };

  const enterpricePlan = async () => {
    const mailtoLink = 'mailto:contacts@datatera.io';
    window.location.href = mailtoLink;
  };

  const manageSubscription = async () => {
    if (userPlan[0]?.sessionId) {
      setIsLoading(true);
      try {
        const res = await api.get('/subscription/manage-subscription', {
          params: {
            sessionId: userPlan[0]?.sessionId,
          },
        });
        if (res.data) {
          setIsLoading(true);
          window.location.replace(res.data.url);
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className={styles.preLoader}>
          <CircularProgress />
        </div>
      ) : (
        <div className={styles.your_plan}>
          <div className={styles.title}>
            <div className={styles.title_row}>
              <div>{plan?.title}</div>
              {plan?.title === 'PLUS' && (
                <div className={styles.p_color}>
                  {userPlan[0]?.interval === 'year'
                    ? 'USD $470/year'
                    : 'USD $49/month'}
                </div>
              )}
            </div>
          </div>
          <div className={styles.modal_btn}>
            <a
              style={{ width: '100%' }}
              href={
                plan?.title === 'ENTERPRISE' && 'mailto:contacts@datatera.io'
              }
            >
              <Button
                onClick={() => {
                  if (userPlan && userPlan[0]?.name !== plan?.title) {
                    plan?.title === 'ENTERPRISE'
                      ? enterpricePlan()
                      : subscribePlan({
                          plan: plan?.title,
                          priceId: 'price_1NV6VVLx4Y8lZhXZceAu7For',
                          priceTag: '$49/month',
                        });
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
          {plan?.title === 'PLUS' && userPlan[0]?.name !== 'PLUS' && (
            <div className={styles.yearly_btn_parent}>
              <div
                onClick={() => {
                  subscribePlan({
                    plan: 'PLUS',
                    priceId: 'price_1NZpqmLx4Y8lZhXZpM69nX1Z',
                    priceTag: '$470/year',
                  });
                }}
                className={styles.yearly_btn}
              >
                Save 20% on yearly
              </div>
            </div>
          )}
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

          {userPlan[0].name === 'PLUS' && plan?.title === 'PLUS' && (
            <div
              onClick={manageSubscription}
              className={`mt-2 ${styles.manage_subscription_btn}`}
            >
              Manage subscription
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PricingModal;
