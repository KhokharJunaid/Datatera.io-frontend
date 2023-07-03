import React from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import "./UploadModal.css";

const UploadModal = (props) => {
  const {
    handleClose,
    show,
    setUploadTextShow,
    handleChangeUploadFile,
    handleUploadFile,
    loading,
  } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center" style={{ fontSize: "24px" }}>
          Upload from
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p
          className="reload_modal_body_para mt-3 mb-4"
          style={{
            color: "#000000",
            fontSize: "14px",
          }}
        >
          Choose a data source
        </p>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Form.Control
            className="rounded-0 uploadField"
            type="file"
            name="upload_file"
            id="upload_file_convert"
            onChange={(e) => {
              handleChangeUploadFile(e);
            }}
            multiple={false}
            accept=".csv,.txt,.json,.docx,.png,.jpg,.jpeg,.xlsx,.html,.htm,.wav,.pptx,.xbrl,.xml,.pdf"
          />
          <label for="upload_file_convert" className="upload_file_convert_btn">
            {loading === "0" ? (
              <Spinner animation="border" variant="secondary" />
            ) : (
              "File"
            )}
          </label>
          <label
            className="upload_file_convert_btn mt-2"
            onClick={() => {
              handleClose();
              setUploadTextShow(true);
            }}
          >
            Text
          </label>
          <Form.Control
            className="rounded-0 uploadField "
            type="file"
            name="upload_file"
            id="upload_file_convert2"
            onChange={(e) => {
              if (e.target.files?.length > 0) {
                handleUploadFile(e.target.files[0], "2");
              }
            }}
            multiple={false}
            accept=".csv,.txt,.json,.docx,.png,.jpg,.jpeg,.xlsx,.html,.htm,.wav,.pptx,.xbrl,.xml,.pdf"
          />
          <label
            for="upload_file_convert2"
            className="upload_file_convert_btn mt-2"
          >
            {loading === "2" ? (
              <Spinner animation="border" variant="secondary" />
            ) : (
              "URLs"
            )}
          </label>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadModal;
