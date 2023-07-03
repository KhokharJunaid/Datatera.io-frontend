import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import plus_icon from "../assets/images/plus_icon.png";
import Drawer from "react-modern-drawer";
import Chat_icon from "../assets/images/Chat_icon.png";
import close from "../assets/images/close.png";
import logout_icon from "../assets/images/logout_icon.png";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import catchAsync from "../utiles/catchAsync";
import { Formik } from "formik";
import * as yup from "yup";
import api from "../api/index";
import { OverlayTrigger, Tooltip, Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../context/auth";
import { ListContext } from "../context/list";
import useWindowDimensions from "../utiles/getWindowDimensions";
import "./sideBar.css";

const Sidebar = () => {
  const { list, setListItems, openSideBar, setOpenSideBar } =
    useContext(ListContext);
  const {  width } = useWindowDimensions();
  const navigate = useNavigate();

  const {  , signOut } = useContext(AuthContext);
  const [ , setIsOpen] = React.useState(true);
  const [updateConversion, setupdateConversion] = useState(null);

  const [param, setParams] = React.useState(null);
  const [firstCheckLocation, setFirstCheckLocation] = React.useState(true);

  //

  const handleButtonClick = (_id) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("id");
    queryParams.append("id", _id);

    navigate("?" + queryParams.toString());
  };

  const location = useLocation();

  const handleButtonClickget = () => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get("id");
    setParams(paramValue);
  };
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [show, setShow] = useState(false);
  const [conversions, setConversions] = useState();

  const schema = yup.object().shape({
    name: yup.string().required("Enter Conversion Name."),
  });

  const handleShow = () => setShow(true);

  const handleSubmit = catchAsync(async (values, resetForm) => {
    if (updateConversion == null) {
      let userId = JSON.parse(localStorage.getItem("user"))?._id;
      values.user = userId;
      let res = await api.post("/conversion", values);
      setConversions([...conversions, res.data.createConversion]);
      setListItems(res.data.createConversion?._id);
      // handleButtonClick(res.data.createConversion?._id);
      setListItems(res.data.createConversion?._id);

      const queryParams = new URLSearchParams(window.location.search);
      queryParams.delete("id");
      queryParams.append("id", res.data.createConversion?._id);

      navigate("?" + queryParams.toString());
    } else {
      let res = await api.patch(`/conversion/${updateConversion._id}`, values);
      setConversions(
        conversions.map((elem) => {
          if (elem._id == res.data.data._id) {
            return (elem = res.data.data);
          } else {
            return elem;
          }
        })
      );
    }
    setFirstCheckLocation(false);
    resetForm();
    handleClose();
  }, toast);

  const openConversionModal = catchAsync(async (user) => {
    setupdateConversion(user);
    setShow(true);
  });

  const handleClose = () => {
    setupdateConversion(null);
    setShow(false);
  };

  const getAllConversions = catchAsync(async () => {
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    let res = await api.get(`/conversion/all-notes/${userId}`);
    setConversions(res.data.getAllConversion);
  });

  useEffect(() => {
    handleButtonClickget();
    getAllConversions();
    setListItems("");
  }, []);

  useEffect(() => {
    if (param !== null && conversions?.length > 0 && firstCheckLocation) {
      const find = conversions?.find((val) => val?._id === param);

      if (find) {
        setListItems(param);
      } else if (find === undefined && param !== "") {
        setListItems("noPer");
      } else if (
        find === undefined &&
        param === null &&
        conversions?.length > 0
      ) {
        setListItems(conversions[0]._id);
      }
    }
    // else if (param !== null && conversions?.length === 0) {
    //   setListItems("noPer");
    // } else if (param === null && conversions?.length > 0) {
    //   setListItems(conversions[0]._id);
    //   const queryParams = new URLSearchParams(window.location.search);
    //   queryParams.delete("id");
    //   queryParams.append("id", conversions[0]._id);

    //   navigate("?" + queryParams.toString());
    // }
  }, [param, conversions, firstCheckLocation]);

  const deleteConversions = catchAsync(async (id) => {
    let res = await api.delete(`/conversion/${id}`);
    let currCons = JSON.parse(localStorage.getItem("currentConverstion"));
    if (currCons === id) {
      localStorage.removeItem("currentConverstion");
      setListItems(null);
    }
    const data = conversions.filter((elem) => {
      return elem._id !== id;
    });
    setConversions(data);
    if (data?.length === 0) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.delete("id");
      navigate("?" + queryParams.toString());
    } else {
      handleButtonClick(conversions[0]._id);
      setListItems(conversions[0]._id);
    }
    setFirstCheckLocation(false);
  });

  const Logout = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <>
      <Drawer
        open={width > 605 ? true : openSideBar === true ? true : false}
        enableOverlay={width <= 605 ? true : false}
        onClose={toggleDrawer}
        direction="left"
        className="sidebarMain"
      >
        {openSideBar ? (
          <img
            src={close}
            alt="close"
            className="closeImg"
            onClick={() => setOpenSideBar(false)}
          />
        ) : null}

        <div className="sidebar_content">
          <div className="new_conversion_main" onClick={handleShow}>
            <img src={plus_icon} alt="plus_icon" />
            <span className="new_conversion_div">New conversion</span>
          </div>
          <div className="notes_logout_main">
            <div className="notes">
              {conversions?.map((elem, index) => {
                var trimmedString = elem.name.substr(0, 16);
                return (
                  <div
                    className={
                      list === elem?._id ? "List selectedList" : "List"
                    }
                    id={`sidebar${index}`}
                    key={elem._id}
                    onClick={() => {
                      setListItems(elem?._id);
                      handleButtonClick(elem?._id);
                    }}
                  >
                    <div className="notes__name_main">
                      <div>
                        <img
                          src={Chat_icon}
                          alt="Chat_icon"
                          className="notes_img"
                        />
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">{elem.name}</Tooltip>
                          }
                        >
                          <span className="conversion_title">
                            {trimmedString >= 17
                              ? `${trimmedString}...`
                              : trimmedString}
                            {/* {trimmedString}... */}
                          </span>
                        </OverlayTrigger>
                      </div>
                      <div>
                        <AiOutlineEdit
                          className="edit_icon"
                          onClick={() => openConversionModal(elem)}
                        />
                        <AiOutlineDelete
                          className="edit_icon"
                          onClick={() => deleteConversions(elem._id)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              {/* <p className="all_history_heading">All History</p> */}
              <hr />
              {/* <div className="updates_faq_div">
                <img
                  src={updates_icon}
                  alt="update-icon"
                  className="update_icon"
                />
                <span>Updates & FAQ</span>
              </div> */}
              <div className="updates_faq_div" onClick={Logout}>
                <img
                  src={logout_icon}
                  alt="update-icon"
                  className="update_icon"
                />
                <span>Log out</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="conversionTitle">
            {updateConversion ? "Edit Conversion" : "Add Conversion"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            enableReinitialize
            initialValues={{
              name: updateConversion?.name,
            }}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit} className="form">
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label className="conversionTitle">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Conversion Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isValid={formik.touched.name && !formik.errors.name}
                    isInvalid={formik.touched.name && formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="submitBtn">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Sidebar;
