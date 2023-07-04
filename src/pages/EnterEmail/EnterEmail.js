import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import styles from "../EnterEmail/EnterEmail.module.css";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/images/logo.jpg";
import { useFormik } from "formik";
import { Button } from "react-bootstrap";
import api from "../../api";

function EnterEmail() {
  const navigate = useNavigate();
  const [isdisabled , setIsDisabled] = useState(false)


  const initialValues = {
    email: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("."),
  });

  const onSubmit = async (values, resetForm) => {
    setIsDisabled(true)
    console.log(values);
    try {
      const res = await api.post("/user/forgot-password", values);
      if (res.data.message) {
        toast(res.data.message);
        navigate("/email-sent");
        resetForm();
        setIsDisabled(true)

      }

     } catch (error) {
      toast(error?.response?.data?.message, { type: "error" });
      console.log(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <div className={styles.signin_main}>
      <div className={styles.pic_div}>
        <img src={logo} className={styles.logo} alt="logo" />
      </div>
      <div className={styles.signinUpper}>
        <div className={styles.signin}>
          <h6 className={styles.login_heading}>Email</h6>
          <p className={styles.explore_future_heading}>
            Please enter your email
          </p>
          <Box
            className={styles.form}
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <TextField
              type="email"
              label="Email"
              name="email"
              variant="outlined"
            
              style={{ marginBottom: "1rem", width: "100%" }}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <Button disabled={isdisabled}  type="submit" className={styles.signin_login_btn}>
              Submit
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default EnterEmail;
