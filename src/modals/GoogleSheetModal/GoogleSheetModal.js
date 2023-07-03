import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "./GoogleSheetModal.css";
import { gapi } from "gapi-script";

const GoogleSheetModal = (props) => {
  const {
    handleClose,
    show,
    handleWriteReportSelected,
    sheetDetails,
    loadingButton,
  } = props;
  const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
  const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] =
    useState(false);
  const [listDocumentsVisibility, setListDocumentsVisibility] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [dataListSource, setDataList] = useState([]);
  const [sheetName, setSheetName] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetLenght, setSheetLength] = useState(-1);
  const [tabs, setTabs] = useState([]);
  const [index, setIndex] = useState(-1);
  const [tabIndex, setTabIndex] = useState("");
  const [sheetData, setSheetData] = useState(null);
  const listFiles = (searchTerm = null) => {
    setIsFetchingGoogleDriveFiles(true);
    // console.log(gapi.client.drive.files);
    gapi.client.drive.files
      .list({
        // pageSize: 10,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime)",
        // q: "mimeType='text/csv'",

        q: "mimeType='application/vnd.google-apps.spreadsheet'",
      })
      .then(function (response) {
        setIsFetchingGoogleDriveFiles(false);
        setListDocumentsVisibility(true);
        const res = JSON.parse(response.body);
        setDocuments(res.files);
      });
  };
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };
  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      setIsLoadingGoogleDriveApi(false);
      listFiles();
    } else {
      handleAuthClick();
    }
  };
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];
  const initClient = () => {
    setIsLoadingGoogleDriveApi(true);
    gapi.client
      .init({
        // apiKey: process.env.REACT_APP_API_KEY,
        // clientId: process.env.REACT_APP_CLIENT_ID,

        // apiKey: "AIzaSyDR9gmJuW-4s7O5ekTPIp7rPxG47CJ9dP8",
        // clientId:
        //   "568004834609-tgvm1olo0v95bln7hq66bltclpf4bijh.apps.googleusercontent.com",

        apiKey: "AIzaSyCZc2xJ96wOOkqtiaaeznrl79Lh0XGEtlE",
        clientId:
          "506067015635-b93dqacndkusi2j5i3b0ig14hn803n0o.apps.googleusercontent.com",

        discoveryDocs: DISCOVERY_DOCS,
        // scope: SCOPES,
        // scope: "https://www.googleapis.com/auth/drive"
        scope:
          "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets",
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          console.log(error);
        }
      );
  };
  const handleClientLoad = () => {
    if ((process.env.LOGGING = "all")) {
      console.log("gapi");
    }
    gapi.load("client:auth2", initClient);
  };
  const handleSheet = (data) => {
    const sheetID = data;
    const key = "AIzaSyCZc2xJ96wOOkqtiaaeznrl79Lh0XGEtlE";
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}?key=${key}`;
    let list = [];

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        let i = 0;
        setSheetLength(data?.sheets?.length);
        data?.sheets?.length > 0 &&
          data?.sheets.forEach((s, index) => {
            const sheetName = s.properties.title;
            const API = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values:batchGet?ranges=${sheetName}&majorDimension=COLUMNS&key=${key}`;
            fetch(API)
              .then((response) => response.json())
              .then((data) => {
                i++;
                const ranges = JSON.parse(
                  JSON.stringify(data?.valueRanges[0]?.range)
                );

                let m = data?.valueRanges[0]?.range?.split("!");

                const body = {
                  name: m[0].replace(/["']/g, ""),
                  rows: data?.valueRanges[0]?.values,
                  range: ranges,
                };
                list.push(body);
                setTabs(list);
                setIndex(i);
              });
          });
      });
  };

  useEffect(() => {
    handleClientLoad();
  }, []);

  useEffect(() => {
    if (documents?.length > 0) {
      let list = [];
      documents.forEach((val) => {
        const body = {
          name: val.name,
          id: val.id,
        };
        list.push(body);
      });

      setDataList(list);
    }
  }, [documents]);

  useEffect(() => {
    if (sheetDetails !== null && dataListSource?.length > 0) {
      setSheetName(sheetDetails?.selectedSheet?.id);
      setSelectedSheet(sheetDetails?.selectedSheet);
      handleSheet(sheetDetails?.selectedSheet?.id);
    }
    if (sheetDetails === null || dataListSource?.length === 0) {
      setSheetName("");
      setSelectedSheet("");
      setTabIndex("");
      setTabs([]);
    }
  }, [dataListSource, sheetDetails]);

  useEffect(() => {
    if (tabs?.length > 0 && sheetDetails !== null) {
      setTabIndex(sheetDetails?.tab);
      const body = {
        selectedSheet,
        tab: sheetDetails?.tab,
      };
      setSheetData(body);
    }
  }, [tabs, sheetDetails]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Modal.Title
          className="text-center"
          style={{ color: "#4AA181", fontSize: "40px" }}
        >
          Connect Google Sheets to Export Data
        </Modal.Title>
        <p
          className="reload_modal_body_para mt-3 mb-4"
          style={{
            color: "#92929D",
            fontSize: "24px",
          }}
        >
          Connect to Google Sheets and send data directly to spreadsheets
        </p>
        <div className="d-flex flex-column justify-content-center align-items-center">
          {!isLoadingGoogleDriveApi &&
            dataListSource?.length > 0 &&
            !isFetchingGoogleDriveFiles && (
              <select
                name="sheetName"
                id="sheetName"
                className="select-input"
                value={sheetName}
                onChange={(e) => {
                  if (e.target.value !== "Table / Sheet name") {
                    const data = dataListSource?.find(
                      (val) => val.id === e.target.value
                    );
                    setSelectedSheet(data);
                    handleSheet(e.target.value);
                    setSheetName(e.target.value);
                  } else if (e.target.value === "Table / Sheet name") {
                    setSheetName(e.target.value);
                    setSelectedSheet("");
                    setTabs([]);
                    setIndex(-1);
                  }
                }}
              >
                <option value="Table / Sheet name">Table / Sheet name</option>

                {dataListSource?.map((val, i) => (
                  <option value={val.id} key={i}>
                    {val?.name}
                  </option>
                ))}
              </select>
            )}
          {isLoadingGoogleDriveApi ||
            (isFetchingGoogleDriveFiles && (
              <Spinner animation="border" variant="secondary" />
            ))}
          {!isLoadingGoogleDriveApi &&
            !isFetchingGoogleDriveFiles &&
            dataListSource?.length > 0 &&
            tabs?.length > 0 &&
            index === sheetLenght && (
              <div>
                <select
                  name="sheetName"
                  id="sheetName"
                  className="select-input mt-3"
                  value={tabIndex}
                  onChange={(e) => {
                    if (e.target.value !== "Select sheet") {
                      const body = {
                        selectedSheet,
                        tab: e.target.value,
                      };
                      setTabIndex(e.target.value);
                      setSheetData(body);
                    } else if (e.target.value === "Select sheet") {
                      setTabIndex(-1);
                      setSheetData(null);
                    }
                  }}
                >
                  <option value="Select sheet">Select sheet</option>

                  {tabs?.map((val, c) => (
                    <option value={val?.range} key={c}>
                      {val?.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          <Button
            variant="dark"
            onClick={() => {
              if (tabIndex !== "" && sheetData !== null) {
                const data = tabs?.find((val) => val?.range === tabIndex);
                if (data) {
                  handleWriteReportSelected(data?.rows, sheetData);
                }
              }
            }}
            className="mt-5"
          >
            Connect Now
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GoogleSheetModal;
