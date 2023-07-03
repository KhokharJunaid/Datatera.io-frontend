import React, { useContext, useState } from "react";
import "./signin.css";
import * as yup from "yup";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import api from "../../api/index";
import catchAsync from "../../utiles/catchAsync";
import googleLogo from "../../assets/images/googlelogo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/images/logo.jpg";
import { auth, provider } from "../../config/firebaseConfig";
import { AuthContext } from "../../context/auth";
// import { Grid } from "@material-ui/core";

const Signup = () => {
  const { isLogin, loginSuccess } = useContext(AuthContext);

  const navigate = useNavigate();

  const [showpassword, setShowpassword] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });
  const handleSubmit = catchAsync(async (values, resetForm) => {
    const res = await api.post("/user/login", values);
    loginSuccess(res.data.token, res.data.data.user);
    navigate("/");
    resetForm();
  }, toast);

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
        navigate("/app");
        // localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (error) {
        toast("Some Error while logged in!", { type: "error" });
        console.log(error);
      }
    });
  };
  return (
    <div className="signin_main">
      <div className="pic_div">
        <img src={logo} className="logo" />
      </div>
      <div className="signin">
        <h6 className="login_heading">Login</h6>
        <p className="explore_future_heading">Explore the future with us</p>
        <Formik
          validationSchema={schema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values, resetForm);
          }}
          enableReinitialize
          initialValues={{
            email: "",
            password: "",
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} className="form">
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  className="inputfield"
                  type="text"
                  placeholder="myemail@gmail.com"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isValid={formik.touched.email && !formik.errors.email}
                  isInvalid={formik.touched.email && formik.errors.email}
                />
                {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback> */}
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="eye_icon_main">
                  <Form.Control
                    type={showpassword ? "text" : "password"}
                    placeholder="Password"
                    className="inputfield"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isValid={formik.touched.password && !formik.errors.password}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
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
                {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.password}
                </Form.Control.Feedback> */}
              </Form.Group>
              <div className="forgot_password_div">
                <Link className="forgot_password_link">Forgot Password?</Link>
              </div>
              <div className="signin_button_main">
                <Link to="/register">
                  <Button className="register_btn" type="submit">
                    Register
                  </Button>
                </Link>
                <Button className="signin_login_btn" type="submit">
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="signin_div_main">
          <p className="signin_with_email">
            <span className="signin_email_span">or signin with e-mail</span>
          </p>
          <div className="signin_div" onClick={() => handleOnClick()}>
            <img src={googleLogo} className="googlelogo" /> Sign in with Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
