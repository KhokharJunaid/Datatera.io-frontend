import React from "react";
import styles from "../components/PricingModal.module.css";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function PricingModal({ plan, userPlan: commingPlan }) {
  const navigate = useNavigate();
  const userPlan = commingPlan[0];

  const subscribePlan = async (plan) => {
    try {
      const res = await api.post(`/user/subscription?plan=${plan}`);
      if (res.data.message) {
        if (plan === "FREE") {
          toast("Your package activated successfully", { type: "success" });
        } else {
          navigate("/done-subscribe");
        }
      }
    } catch (error) {
      toast(error?.response?.data?.message, { type: "error" });
    }
  };

  const enterpricePlan = async () => {
    const mailtoLink = "mailto:contacts@datatera.io";
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.your_plan}>
      <div className={styles.title}>
        <div>{plan?.title}</div>
        <div className={styles.p_color}>{plan?.price}</div>
      </div>
      <div className={styles.modal_btn}>
        <Button
          // variant="secondary"
          onClick={() => {
            if (userPlan?.name !== plan?.title) {
              plan?.title === "ENTERPRISE"
                ? enterpricePlan()
                : subscribePlan(plan?.title);
            }
          }}
          className={
            userPlan?.name === plan?.title ? styles?.freebtn : styles?.btn
          }
          style={
            userPlan?.name === plan?.title ? { cursor: "not-allowed" } : {}
          }
        >
          {userPlan?.name === plan?.title ? "Current plan" : plan?.btn_title}
        </Button>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={userPlan?.name === plan?.title ? "/icon_2.png" : "/icon_1.png"}
            alt="img"
          />
        </div>
        <div>{plan?.d_1}</div>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={userPlan?.name === plan?.title ? "/icon_2.png" : "/icon_1.png"}
            alt="img"
          />
        </div>
        <div>{plan?.d_2}</div>
      </div>
      <div className={styles.description}>
        <div>
          <img
            src={userPlan?.name === plan?.title ? "/icon_2.png" : "/icon_1.png"}
            alt="img"
          />
        </div>
        <div>{plan?.d_3}</div>
      </div>
    </div>
  );
}

export default PricingModal;
