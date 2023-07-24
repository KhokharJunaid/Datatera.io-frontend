import React, { useState, useEffect } from 'react';
import api from '../../api';
import { toast } from 'react-toastify';

const PlansContext = React.createContext({});

const PlanProvider = ({ children }) => {
  const [userPlan, setUserPlan] = useState();
  const [search, setTotalSearches] = useState({
    remainingUploads: null,
    totalUploads: null,
  });

  const getToken = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token;
  };

  const token = getToken();

  console.log('token', token);

  const handleTotalUploads = () => {
    api
      .get(`/user/total-uploads`)
      .then((res) => {
        setTotalSearches(res?.data);
      })
      .catch((err) => {
        // toast(err?.response?.data?.message, { type: "error" });
      });
  };

  const getUserPlan = () => {
    api
      .get(`/user/me`)
      .then((res) => {
        setUserPlan(res.data?.subscriptions);
        handleTotalUploads();
      })
      .catch((err) => {
        console.log('err in me ', err);
      });
  };

  const handleValidatePlan = () => {
    api
      .post('/user/validate-plan')
      .then(() => {
        getUserPlan();
      })
      .catch((err) => {
        toast(err?.response?.data?.message, { type: 'error' });
      });
  };

  useEffect(() => {
    if (token) {
      handleValidatePlan();
    }
  }, [token]);

  return (
    <PlansContext.Provider value={{ userPlan, search, handleValidatePlan }}>
      {children}
    </PlansContext.Provider>
  );
};

export { PlansContext, PlanProvider };
