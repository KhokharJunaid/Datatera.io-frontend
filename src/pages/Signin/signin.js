import React, { useContext, useState } from "react";
import { Box, TextField } from "@mui/material";
import "./signin.css";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import api from "../../api/index";
import catchAsync from "../../utiles/catchAsync";
import googleLogo from "../../assets/images/googlelogo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/images/logo.jpg";
import { auth, provider } from "../../config/firebaseConfig";
import { AuthContext } from "../../context/auth";
import { useFormik } from "formik";
import Line_Divider from "../../assets/images/line_divider.png";

const Signin = () => {
  const { isLogin, loginSuccess } = useContext(AuthContext);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const [showpassword, setShowpassword] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("."),
    password: yup.string().required("."),
  });
  const onSubmit = async (values, resetForm) => {
    try {
      const res = await api.post("/user/login", values);
      loginSuccess(res.data.token, res.data.data.user);
      navigate("/");
      resetForm();
    } catch (error) {
      toast(error?.response?.data?.message, { type: "error" });
      console.log(error);
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
        let res = await api.post("/user/googleSignin", data);
        loginSuccess(res.data.token, res.data.data.user);
        navigate("/");
      } catch (error) {
        toast("Some Error while logged in!", { type: "error" });
        console.log(error);
      }
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  return (
    <div className="signin_main">
      <div className="pic_div">
        <img src={logo} className="logo" />
      </div>
      <div className="signinUpper">
        <div className="signin">
          <h6 className="login_heading">Login</h6>
          <p className="explore_future_heading">Explore the future with us</p>
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
              variant="outlined"
              style={{ marginBottom: "1rem", width: "100%" }}
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <div className="eye_icon_main">
              <TextField
                type={showpassword ? "text" : "password"}
                name="password"
                label="Password"
                variant="outlined"
                style={{ width: "100%" }}
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              {showpassword ? (
                <AiOutlineEyeInvisible
                  className="eye_icon"
                  onClick={(e) => {
                    setShowpassword(!showpassword);
                  }}
                />
              ) : (
                <AiOutlineEye
                  className="eye_icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowpassword(!showpassword);
                  }}
                />
              )}
            </div>
            <div className="forgot_password_div">
              <Link className="forgot_password_link">Forgot Password?</Link>
            </div>
            <div className="signin_button_main">
              <Link to="/register">
                <Button className="register_btn" type="submit">
                  Register
                </Button>
              </Link>
              <Button type="submit" className="signin_login_btn">
                Login
              </Button>
            </div>
          </Box>
          <div className="signin_div_main">
            <p className="signin_with_email">
              <span className="signin_email_span">Or sign in with e-mail</span>
            </p>
            <div className="signin_div" onClick={() => handleOnClick()}>
              <img src={googleLogo} className="googlelogo" /> Sign in with
              Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signin;
