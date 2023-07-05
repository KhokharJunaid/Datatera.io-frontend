import React, { useState } from "react";
import * as yup from "yup";
import { Button } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import api from "../../api/index";
import googleLogo from "../../assets/images/googlelogo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/images/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebaseConfig";
import "./signup.css";
import { useFormik } from "formik";
import { Box, TextField } from "@mui/material";
import Loader from "../../components/shared/loader/Loader";

const Signup = () => {
  const navigate = useNavigate();

  const [showpassword, setShowpassword] = useState(false);
  const [showconfirmpassword, setConfirmpassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("."),
    password: yup.string().required("."),
    passwordConfirm: yup.string().required("."),
  });

  const onSubmit = async (values, resetForm) => {
    try {
      setIsLoading(true);
      if (
        values?.password === values?.passwordConfirm &&
        values?.password?.length >= 8
      ) {
        await api.post("/user/register", values);
        navigate("/");
        resetForm();
      } else if (values?.password?.length < 8) {
        toast("Password must contains at least 8 characters!", {
          type: "error",
        });
      } else {
        toast("Password and confirm password should be same!", {
          type: "error",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast(error?.response?.data?.message, { type: "error" });
    }
  };

  const handleOnClick = async () => {
    signInWithPopup(auth, provider).then(async (res) => {
      let data = {
        name: res?.user?.displayName,
        email: res?.user?.email,
        photo: res?.user?.photoURL,
        token: res?.user?.accessToken,
      };
      try {
        await api.post("/user/googleSignin", data);
        navigate("/app");
      } catch (error) {
        toast("Some Error while logged in!", { type: "error" });
      }
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <div className="signup_main">
      <div className="pic_div">
        <img src={logo} className="logo" alt="" />
      </div>
      <div className="signUpInner">
        <div className="signup">
          <h6 className="register_heading">Register</h6>
          <p className="explore_future_heading">Explore the future with us</p>
          {isLoading && <Loader />}
          <Box
            className="form"
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <TextField
              type="email"
              label="Email"
              name="email"
              disabled={isLoading}
              variant="outlined"
              className="register_input_field"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <div className="eye_icon_main">
              <TextField
                type={showpassword ? "text" : "password"}
                disabled={isLoading}
                name="password"
                label="Password"
                variant="outlined"
                className="register_input_field"
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              {showpassword ? (
                <AiOutlineEyeInvisible
                  className="eye_icon_signup"
                  onClick={(e) => {
                    setShowpassword(!showpassword);
                  }}
                />
              ) : (
                <AiOutlineEye
                  className="eye_icon_signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowpassword(!showpassword);
                  }}
                />
              )}
            </div>
            <div className="eye_icon_main">
              <TextField
                type={showconfirmpassword ? "text" : "password"}
                name="passwordConfirm"
                label="Password Confirm"
                className="register_input_field"
                disabled={isLoading}
                variant="outlined"
                {...formik.getFieldProps("passwordConfirm")}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
              />

              {showconfirmpassword ? (
                <AiOutlineEyeInvisible
                  className="eye_icon_signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmpassword(!showconfirmpassword);
                  }}
                />
              ) : (
                <AiOutlineEye
                  className="eye_icon_signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirmpassword(!showconfirmpassword);
                  }}
                />
              )}
            </div>
            <div className="button_main">
              <Link to="/">
                <Button
                  className="Login_btn"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
              </Link>
              <Button className="signup_btn" type="submit" disabled={isLoading}>
                {isLoading ? "Signup..." : "Signup"}
              </Button>
            </div>
          </Box>
          <div className="signin_div_main">
            <p className="signin_with_email">
              <span className="signin_email_span">or signin with e-mail</span>
            </p>
            <div className="signin_div" onClick={() => handleOnClick()}>
              <img
                src={googleLogo}
                className="googlelogo"
                alt="google signin"
              />
              Sign in with Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
