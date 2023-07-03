import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "./UploadTextModal.css";
import { Checkbox, FormControlLabel, Input } from "@material-ui/core";
import { green } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

const UploadTextModal = (props) => {
  const {
    handleClose,
    show,
    handleUploadFile,
    loading,
    list,
    setLoadingData,
    textCheckBox,
    setTextCheckBox,
  } = props;
  const [uploadText, setUploadText] = useState("");
  const [returnRowsLimit, setReturnRowsLimit] = useState(0);
  useEffect(() => {
    setUploadText("");
  }, [show]);
  const CustomCheckbox = styled(Checkbox)`
    color: green; /* Replace with your desired shade of green */
    &:focus {
      background-color: green; /* Replace with your desired focus color */
    }
    &.Mui-checked {
      color: green; /* Replace with your desired shade of green */
    }
  `;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center" style={{ fontSize: "24px" }}>
          Upload text
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          name="uploadText"
          onChange={(e) => {
            setUploadText(e.target.value);
          }}
          style={{
            border: "1px solid #E2E2EA",
            borderRadius: "10px",
            padding: "15px",
            width: "100%",
          }}
          rows="10"
          minlength="5"
        >
          {uploadText}
        </textarea>
        <div
          style={{
            background: "#F1F1F5",
            borderRadius: "11px",
            width: "100px",
            textAlign: "center",
            position: "absolute",
            top: "5px",
            left: "40px",
            color: "#44444F",
          }}
        >
          Text data
        </div>
        {uploadText?.length < 10 && (
          <h5 className="text-center" style={{ fontSize: "14px" }}>
            minimum 10 - characters
          </h5>
        )}
        <FormControlLabel
          className="d-flex align-items-center "
          control={
            <CustomCheckbox
              defaultChecked={textCheckBox}
              onChange={(e) => {
                setTextCheckBox(e.target.checked);
              }}
            />
          }
          label="Process URLs"
        />
        <div className="mb-3">
          <span>Return rows limit (0 for unlimited rows): </span>
          <Input
            type="number"
            value={returnRowsLimit}
            onChange={(e) => {
              setReturnRowsLimit(e.target.value);
            }}
          />
        </div>

        <div className="d-flex justify-content-center">
          <Button
            variant="dark"
            disabled={
              uploadText?.length < 10 ? true : false || returnRowsLimit === ""
            }
            onClick={() => {
              const file = new File([uploadText], "text.txt", {
                type: "text/plain",
              });
              handleUploadFile(file, "3", returnRowsLimit);
            }}
          >
            {loading === "3" ? (
              <Spinner animation="border" variant="secondary" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadTextModal;
