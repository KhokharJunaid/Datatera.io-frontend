import React from "react";
import { CircularProgress } from "@mui/material";
import styles from "../../shared/loader/Loader.module.css";

function Loader() {
  return (
    <div className={styles.spinner} style={{ width: "100%" }}>
      <div
        style={{
          backgroundColor: "#f1f1f5",
          borderRadius: "10px",
          width: "fit-content",
          height: "fit-content",
          padding: "10px",
          paddingBottom: "5px",
        }}
      >
        <CircularProgress
          style={{
            color: "#4aa181",
          }}
        />
      </div>
    </div>
  );
}

export default Loader;
