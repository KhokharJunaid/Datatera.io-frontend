import React, { useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import api from "../../api/index";
import catchAsync from "../../utiles/catchAsync";
import googleLogo from "../../assets/images/googlelogo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/images/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebaseConfig";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [showpassword, setShowpassword] = useState(false);
  const [showconfirmpassword, setConfirmpassword] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    passwordConfirm: yup.string().required(),
    // passwordConfirm: yup
    // .string()
    // .oneOf([yup.ref("password"), null], "Passwords must match")
    // .required(),
  });
  const handleSubmit = catchAsync(async (values, resetForm) => {
    if (
      values?.password === values?.passwordConfirm &&
      values?.password?.length >= 8
    ) {
      const res = await api.post("/user/register", values);
      navigate("/");
      resetForm();
    } else if (values?.password?.length < 8) {
      toast("Password must contains at least 8 characters!", { type: "error" });
    } else {
      toast("Password and confirm password should be same!", { type: "error" });
    }
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
      }
    });
  };

  return (
    <div className="signup_main">
      <div className="pic_div">
        <img src={logo} className="logo" alt="" />
      </div>
      <div className="signup">
        <h6 className="register_heading">Register</h6>
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
            passwordConfirm: "",
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} className="form">
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  // className="inputfield"
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

              <Form.Group controlId="passwordConfirm" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="eye_icon_main">
                  <Form.Control
                    type={showconfirmpassword ? "text" : "password"}
                    placeholder="Confirm password"
                    name="passwordConfirm"
                    className="inputfield"
                    value={formik.values.passwordConfirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isValid={
                      formik.touched.passwordConfirm &&
                      !formik.errors.passwordConfirm
                    }
                    isInvalid={
                      formik.touched.passwordConfirm &&
                      formik.errors.passwordConfirm
                    }
                  />
                  {showconfirmpassword ? (
                    <AiOutlineEyeInvisible
                      className="eye_icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmpassword(!showconfirmpassword);
                      }}
                    />
                  ) : (
                    <AiOutlineEye
                      className="eye_icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmpassword(!showconfirmpassword);
                      }}
                    />
                  )}
                </div>
                {/* <Form.Control.Feedback type="invalid">
                  {formik.errors.passwordConfirm}
                </Form.Control.Feedback> */}
              </Form.Group>
              <div className="button_main">
                <Link to="/">
                  <Button className="Login_btn" type="submit">
                    Login
                  </Button>
                </Link>
                <Button className="signup_btn" type="submit">
                  Signup
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
            <img src={googleLogo} className="googlelogo" alt="google signin" />{" "}
            Sign in with Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
