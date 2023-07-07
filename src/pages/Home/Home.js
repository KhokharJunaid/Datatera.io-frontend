/* eslint-disable array-callback-return */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  OverlayTrigger,
  Spinner,
  Tab,
  Table,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import "react-modern-drawer/dist/index.css";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import api from "../../api";
import deleteImg from "../../assets/images/delete.png";
import file_image from "../../assets/images/file_image.png";
import logo from "../../assets/images/logo.jpg";
import Sidebar from "../../components/sidebar";
import { ListContext } from "../../context/list";
import GoogleSheetModal from "../../modals/GoogleSheetModal/GoogleSheetModal";
import UploadModal from "../../modals/UploadFileModal/UploadModal.js";
import UploadTextModal from "../../modals/UploadTextModal/UploadTextModal";
import useWindowDimensions from "../../utiles/getWindowDimensions";
import "./Home.css";

const Home = () => {
  const { list, openSideBar, setOpenSideBar } = useContext(ListContext);
  const { width } = useWindowDimensions();
  const [step, setStep] = useState("step1");
  const [show, setShow] = useState(false);
  const [maxSizeErr, setMaxSizeErr] = useState(false);
  const [tableHeaders, setTableHeaders] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [data, setData] = useState(null);
  const [file, setfile] = useState("");
  const [convertedFile, setConvertedfile] = useState([]);
  const [loading, setLoading] = useState([]);
  const [appendedModal, setAppendedModal] = useState(false);
  const [googleSheetShow, setGoogleSheetShow] = useState(false);
  const [uploadShow, setUploadShow] = useState(false);
  const [uploadTextShow, setUploadTextShow] = useState(false);

  const [sheetDetailsWrite, setSheetDetailsWrite] = useState(null);
  const [sheetDetails, setSheetDetails] = useState(null);
  const [updateSheetLoading, setUpdateSheetLoading] = useState(false);
  const [textCheckBox, setTextCheckBox] = useState(false);

  const [search, totalSearches] = useState({
    remainingUploads: null,
    totalUploads: null,
  });

  const [loadingData, setLoadingData] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleGoogleShow = () => setGoogleSheetShow(!googleSheetShow);
  const handleUpload = () => setUploadShow(!uploadShow);
  const handleUploadText = () => setUploadTextShow(!uploadTextShow);

  useEffect(() => {
    getConversionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);
  const readFile = (selectedFile) => {
    const file = selectedFile;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "array", raw: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let dupData1 = jsonData?.filter((el) => el?.length > 0);
      let dupData = JSON.parse(JSON.stringify(dupData1));
      if (dupData?.length > 0) {
        let userId = JSON.parse(localStorage.getItem("user"))?._id;
        const head = JSON.parse(JSON.stringify(dupData[0]));
        setfile(selectedFile);
        setStep("step2");

        let values = {
          user: userId,
          data: [{ tableHeaders: head, tableData: dupData }],
          csvFileName: selectedFile?.name,
          csvFileSize: selectedFile?.size,
          conversion: list,
          sheetDetailsWrite: { empty: "" },
        };
        try {
          api.post("/conversion/addData", values).then((res) => {
            getConversionData(true);
            handleTotalUploads();
            handleValidatePlan();
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChangeCsv = (e) => {
    let file = e.target.files[0];
    if (file?.size / 1024 / 1024 > 5) {
      setMaxSizeErr(true);
    } else {
      readFile(file);
    }
  };
  const getConversionData = async (set = false) => {
    if (list) {
      try {
        let res = await api.get(`/conversion/getData/${list}`);
        setData(res?.data);
        if (res?.data) {
          setTableHeaders(res?.data?.data[0]?.tableHeaders);
          setfile({
            name: res?.data?.csvFileName,
            size: res?.data?.csvFileSize,
          });

          setTableData(res?.data?.data[0]?.tableData);
          setStep("step2");
        } else {
          setfile(null);

          setTableHeaders(null);
          setTableData(null);
          setStep("step1");
        }
      } catch (error) {
        console.log(error);
      }
      setLoadingData("");
      setTextCheckBox(false);
      setUpdateSheetLoading(false);
    }
  };

  const handleReload = () => {
    try {
      api.delete(`/conversion/delData/${list}`);
      setData(null);
      setConvertedfile(convertedFile?.filter((el) => el?.list !== list));
      handleClose();
      setStep("step1");
    } catch (error) {
      console.log(error);
    }
  };

  function downloadCSV() {
    const ws = XLSX.utils.json_to_sheet(data?.convertedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Converted-Data");
    XLSX.writeFile(wb, "Data.xlsx");
  }

  function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    let finalDate = new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
    return `${finalDate.getDate()}-${finalDate.getMonth()}-${finalDate.getYear()}`;
  }

  const handleUploadFile = async (
    selectedFile,
    loadingTemp,
    returnRowsLimit
  ) => {
    setLoadingData(loadingTemp);
    setLoading([...loading, list]);
    let allFiles = convertedFile?.filter((el) => el?.list !== list);
    setConvertedfile([...allFiles, { name: selectedFile?.name, list }]);
    let finalTxtData = [];

    tableData?.map((el) => {
      let obj = {};
      tableHeaders?.map((hd, i) => {
        obj[hd] = el[i];
      });
      delete obj["Date/Time"];
      delete obj["FileName"];
      finalTxtData.push(obj);
      obj = {};
    });

    if ((process.env.LOGGING = "all")) {
      console.log("Sample file to the API..", finalTxtData);
    }
    const sample_file = new Blob([JSON.stringify(finalTxtData)], {
      type: "text/plain",
    });

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sample_file", sample_file);
    formData.append(
      "processUrls",
      `${textCheckBox || loadingTemp === "2" ? true : false}`
    );
    formData.append(
      "returnRowsLimit",
      `${returnRowsLimit ? returnRowsLimit : null}`
    );

    if ((process.env.LOGGING = "all")) {
      console.log("Data file to the API..", selectedFile.name);
    }
    let res;
    try {
      res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/conversion/uploadFile`,
        formData
      );
    } catch (error) {
      if (error?.response?.data?.detail) {
        toast(`${error?.response?.data?.detail}`, { type: "error" });
      } else if (error?.message) {
        toast(`${error?.message}`, { type: "error" });
      }

      if (loading?.length > 0) {
        setLoading(loading?.filter((el) => el !== list));
      }
      setLoadingData("");
    }
    if ((process.env.LOGGING = "all")) {
      console.log("Response from API..", res);
    }

    if (res) {
      try {
        if (res.data?.status_code) {
          document.getElementById("upload_file_convert").value = "";
          toast(`${res.data?.detail}`, { type: "error" });
          if (loading?.length > 0) {
            setLoading(loading?.filter((el) => el !== list));
          }
          setLoadingData("");
        } else if (res?.data?.length > 0) {
          let convertedData =
            data?.convertedData?.length > 0
              ? [...data?.convertedData, ...res.data]
              : res.data;

          if ((process.env.LOGGING = "all")) {
            console.log(convertedData);
          }

          await api.patch(`/conversion/updateData/${data?._id}`, {
            convertedData,
            fileName: selectedFile?.name,
            lastResponseData: res.data,
            sheetDetails: sheetDetails,
          });

          setUploadShow(false);
          setUploadTextShow(false);
          getConversionData();
          document.getElementById("upload_file_convert").value = "";
          setAppendedModal(true);
          setLoading(loading?.filter((el) => el !== list));
        } else if (res?.data?.length === 0) {
          toast(`No data returned after processing file`, { type: "error" });
          setLoadingData("");
        }
      } catch (error) {
        toast(error?.response?.data?.message, { type: "error" });
        setLoadingData("");
      }
    }
  };

  const handleChangeUploadFile = async (e) => {
    let file = e.target.files[0];
    if (file?.size / 1024 / 1024 > 15) {
      toast("Maximum file size should be of 15mb", { type: "error" });
    } else {
      handleUploadFile(file, "0");
    }
  };

  const handleDeleteRow = async (row, index, type) => {
    try {
      if (type === "csv") {
        let d = JSON.parse(JSON.stringify(tableData));
        d?.splice(index, 1);
        let updatedData = data;
        updatedData.data[0].tableData = d;
        if ((process.env.LOGGING = "all")) {
          console.log("updatedData", updatedData);
        }

        await api.patch(`/conversion/updateData/${data?._id}`, {
          data: updatedData?.data,
        });
        // setTableData(updatedData);
        // setData(updatedData?.data[0]?.tableData);
        getConversionData();
      } else {
        let d = data?.convertedData;
        d?.splice(index, 1);
        await api.patch(`/conversion/updateData/${data?._id}`, {
          convertedData: d,
        });
        setData({ ...data, convertedData: d });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWriteReportSelected = (data2, sheetDetails) => {
    setSheetDetailsWrite(sheetDetails);
    setUpdateSheetLoading(true);
    api
      .patch(`/conversion/updateData/${data?._id}`, {
        sheetDetailsWrite: sheetDetails,
      })
      .then((res) => {
        getConversionData();
        handleGoogleShow();
      });
  };
  const unlinkGoogleSheet = (data2, sheetDetails) => {
    setSheetDetailsWrite(null);
    setSheetDetails(null);

    api
      .patch(`/conversion/updateData/${data?._id}`, {
        sheetDetailsWrite: { empty: "" },
      })
      .then((res) => {
        getConversionData();
      });
  };

  useEffect(() => {
    if (data?.sheetDetailsWrite && data?.sheetDetailsWrite?.empty === "") {
      setSheetDetails(null);
    } else if (data?.sheetDetailsWrite) {
      setSheetDetails(data?.sheetDetailsWrite);
    } else {
      setSheetDetails(null);
    }
  }, [data]);

  const email = JSON.parse(localStorage.getItem("user"))?.email;

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((clipboardText) => {
        if (clipboardText?.length > 0) {
          const file = new File([clipboardText], "", {
            type: "text/csv",
          });
          readFile(file);
        }
      })
      .catch((error) => {
        console.log("Failed to read clipboard data:", error);
      });
  };

  const [userPlan, setUserPlan] = useState();

  const getUserPlan = async () => {
    await api
      .get(`/user/me`)
      .then((res) => setUserPlan(res.data?.subscriptions));
  };

  const handleTotalUploads = async () => {
    await api
      .get(`/user/total-uploads`)
      .then((res) => {
        totalSearches(res?.data);
      })
      .catch((err) => {
        toast(err?.response?.data?.message, { type: "error" });
      });
  };

  const handleValidatePlan = async () => {
    await api
      .post("/user/validate-plan")
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        toast(err?.response?.data?.message, { type: "error" });
      });
  };

  useEffect(() => {
    handleTotalUploads();
    handleValidatePlan();
    getUserPlan();
  }, []);

  return (
    <>
      <>
        <div className="main">
          <div className="sidebar">
            <Sidebar />
          </div>
          {list === "noPer" ? (
            <div className="d-flex h-100 align-items-center justify-content-center">
              <h2 style={{ marginLeft: width <= 605 ? "" : "300px" }}>
                You do not have an access to this conversion or the conversion
                not exists
              </h2>
            </div>
          ) : (
            <>
              <div className="header">
                <div className="logo_main">
                  <u
                    className="me-3"
                    style={{
                      fontSize: "18px",
                      textAlign: "right",
                    }}
                  >
                    {email}
                  </u>
                  <img src={logo} className="Home_logo" alt="" />
                </div>
                <div>
                  {width <= 605 ? (
                    <AiOutlineMenu
                      className="menuIcon"
                      onClick={() => setOpenSideBar(!openSideBar)}
                    />
                  ) : null}
                  <div>
                    <Tabs
                      defaultActiveKey="conversion"
                      id="uncontrolled-tab-example"
                    >
                      <Tab
                        eventKey="conversion"
                        title="Conversion"
                        className="conversion"
                      >
                        {userPlan?.length > 0 && (
                          <div
                            style={{
                              fontSize: "18px",
                              marginTop: "10px",
                              marginLeft: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            Remaining uploads: {search?.remainingUploads}/
                            {search?.totalUploads}
                          </div>
                        )}
                        {step === "step1" && list ? (
                          <>
                            <div className="Home_content_main">
                              <div className="home_content">
                                <h3 className="home_content_heading">Step 1</h3>
                                <p className="upload_title">
                                  Upload an CSV file in a format you want to to
                                  collect with several samples of data
                                </p>

                                <div
                                  className={`upload_csv_file_main ${
                                    maxSizeErr && "maxSizeError"
                                  }`}
                                >
                                  {search?.remainingUploads === 0 && (
                                    <div
                                      className={`upload_error ${
                                        maxSizeErr && "labelError"
                                      }`}
                                      style={{ marginBottom: "10px" }}
                                    >
                                      Your remaining uploads will be not enough
                                      to upload file
                                    </div>
                                  )}
                                  <Form.Control
                                    className="rounded-0 uploadField "
                                    type="file"
                                    name="image"
                                    id="upload_csv"
                                    onChange={(e) => handleChangeCsv(e)}
                                    multiple={false}
                                    accept=".csv"
                                  />
                                  <div
                                    className={`${width > 912 ? "d-flex" : ""}`}
                                  >
                                    <label
                                      for="upload_csv"
                                      className={
                                        search?.remainingUploads === 0
                                          ? "upload_csv_btn m-1 disabled"
                                          : "upload_csv_btn m-1"
                                      }
                                    >
                                      Upload CSV files
                                    </label>

                                    <Button
                                      disabled={
                                        search?.remainingUploads === 0
                                          ? true
                                          : false
                                      }
                                      variant="dark"
                                      style={{
                                        width: "263px",
                                        height: "48px",
                                        borderRadius: "10px",
                                        fontWeight: "600",
                                        fontSize: "12px",
                                      }}
                                      className="m-1 "
                                      onClick={handlePaste}
                                    >
                                      {loading === "4" ? (
                                        <Spinner
                                          animation="border"
                                          variant="secondary"
                                        />
                                      ) : (
                                        "From clipboard"
                                      )}
                                    </Button>
                                  </div>
                                  <p
                                    className={`upload_error ${
                                      maxSizeErr && "labelError"
                                    }`}
                                  >
                                    Max file size - 5 mb.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : step === "step2" && list ? (
                          <div className="Home_content_main">
                            <div className="home_content">
                              <h3 className="home_content_heading">Step 2</h3>
                              <p className="upload_title">
                                Upload a file in any format you want to
                                transform
                              </p>
                              <div className="template_upload_file_main">
                                <div className="template_csv_main">
                                  <div className="template_csv">
                                    <div className="template_csv_heading_main">
                                      <div className="csvHeader">
                                        <img src={file_image} alt="img" />
                                        <span className="template_heading">
                                          {file?.name}
                                        </span>
                                        {/* <div>
                     <span className="file_size">
                       {(file?.size / 1024 / 1024).toFixed(2)}
                     </span>
                   </div> */}
                                      </div>

                                      <div className="downloading_img_main">
                                        <Button
                                          variant="secondary"
                                          className="downloading_img"
                                          onClick={handleShow}
                                        >
                                          Reload CSV
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="template_csv_main">
                                  <div className="template_csv">
                                    <div className="template_csv_heading_main">
                                      <OverlayTrigger
                                        overlay={
                                          convertedFile?.find(
                                            (el) => el?.list === list
                                          )?.name?.length > 0 ? (
                                            <Tooltip id="tooltip-disabled">
                                              {
                                                convertedFile?.find(
                                                  (el) => el?.list === list
                                                )?.name
                                              }
                                            </Tooltip>
                                          ) : (
                                            <></>
                                          )
                                        }
                                      >
                                        <span className="file_size">
                                          {convertedFile?.find(
                                            (el) => el?.list === list
                                          )
                                            ? convertedFile?.find(
                                                (el) => el?.list === list
                                              )?.name?.length > 18
                                              ? `${convertedFile
                                                  ?.find(
                                                    (el) => el?.list === list
                                                  )
                                                  ?.name?.slice(0, 18)}...`
                                              : convertedFile?.find(
                                                  (el) => el?.list === list
                                                )?.name
                                            : " Max file size - 1mb."}
                                        </span>
                                      </OverlayTrigger>

                                      <label
                                        className="upload_file_convert_btn"
                                        onClick={() => {
                                          setUploadShow(true);
                                        }}
                                      >
                                        Upload from
                                      </label>
                                      {/* <Form.Control
                                      className="rounded-0 uploadField"
                                      type="file"
                                      name="upload_file"
                                      id="upload_file_convert"
                                      onChange={(e) =>
                                        handleChangeUploadFile(e)
                                      }
                                      multiple={false}
                                      accept=".csv,.txt,.json,.docx,.png,.jpg,.jpeg,.xlsx,.html,.htm,.wav,.pptx,.xbrl,.xml,.pdf"
                                    />
                                    <label
                                      for="upload_file_convert"
                                      className="upload_file_convert_btn"
                                    >
                                      {loading?.filter((el) => el === list)
                                        ?.length > 0 ? (
                                        <Spinner
                                          animation="border"
                                          variant="secondary"
                                        />
                                      ) : (
                                        "Upload file to convert"
                                      )}
                                    </label> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="data_template_main">
                                <div className="mb-2 tableMainInner">
                                  <div className="d-flex">
                                    <p className="data_template_heading d-flex align-items-center mt-2">
                                      Data
                                    </p>
                                    {sheetDetails === null ? (
                                      <Button
                                        variant="secondary"
                                        className="downloading_img ms-3 btn-light"
                                        onClick={handleGoogleShow}
                                      >
                                        Connect Google Sheets to Export
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="secondary"
                                        className="downloading_img ms-3 btn-light"
                                        onClick={unlinkGoogleSheet}
                                      >
                                        Disable Google Sheets
                                      </Button>
                                    )}
                                  </div>

                                  {data?.convertedData?.length > 0 ? (
                                    <Button
                                      className="exportBtn"
                                      onClick={() => downloadCSV()}
                                    >
                                      Export
                                    </Button>
                                  ) : null}
                                </div>
                                <div className="tableData">
                                  <Table>
                                    <thead className="table_heading">
                                      <tr>
                                        {tableHeaders?.map((el) => {
                                          return <th>{el}</th>;
                                        })}
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody className="table_body">
                                      {tableData?.map((el, index) => {
                                        return (
                                          <tr>
                                            {el?.map((value) => {
                                              return <td>{value}</td>;
                                            })}
                                            <td>
                                              <img
                                                src={deleteImg}
                                                onClick={() =>
                                                  handleDeleteRow(
                                                    el,
                                                    index,
                                                    "csv"
                                                  )
                                                }
                                                alt="delete"
                                                className="delImg"
                                              />
                                            </td>
                                          </tr>
                                        );
                                      })}
                                      {data?.convertedData?.map((el, index) => {
                                        return (
                                          <tr style={{ color: "#44444F" }}>
                                            {Object.keys(el).map(function (
                                              detail,
                                              id
                                            ) {
                                              return <td>{el[detail]}</td>;
                                            })}
                                            <td>
                                              <img
                                                src={deleteImg}
                                                onClick={() =>
                                                  handleDeleteRow(el, index)
                                                }
                                                alt="delete"
                                                className="delImg"
                                              />
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
              {/* reload modal  */}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title className="reloadTitle">
                    Reloading the CSV File
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className="reload_modal_body_para">
                    Are you sure? After reboot all data will be cleared
                  </p>
                  <div className="reload_btn_main">
                    <Button variant="dark" onClick={() => handleReload()}>
                      Reload
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
              {/* appended modal  */}
              <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={appendedModal}
              >
                <Modal.Body>
                  <div className="appendedModalBody">
                    <p className="appendedTxt">Data successfully</p> <br />
                    <p className="appendedTxt">appended</p>
                    <Button
                      className="exportBtn okBtn mt-5"
                      onClick={() => setAppendedModal(false)}
                    >
                      Ok
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
              <GoogleSheetModal
                handleClose={handleGoogleShow}
                show={googleSheetShow}
                handleWriteReportSelected={handleWriteReportSelected}
                sheetDetails={sheetDetails}
              />
              <UploadModal
                setLoadingData={setLoadingData}
                handleClose={handleUpload}
                show={uploadShow}
                setUploadTextShow={setUploadTextShow}
                handleChangeUploadFile={handleChangeUploadFile}
                loading={loadingData}
                list={list}
                handleUploadFile={handleUploadFile}
              />
              <UploadTextModal
                setLoadingData={setLoadingData}
                handleClose={handleUploadText}
                show={uploadTextShow}
                handleUploadFile={handleUploadFile}
                loading={loadingData}
                list={list}
                textCheckBox={textCheckBox}
                setTextCheckBox={setTextCheckBox}
              />
            </>
          )}
        </div>
      </>
    </>
  );
};

export default Home;
